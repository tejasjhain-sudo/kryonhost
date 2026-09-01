import crypto from 'crypto';
import { db } from '../repository/db';
import { Order, VPS, ProvisioningJob } from '../models/types';
import { resourceService } from './resource.service';
import { capacityService } from './capacity.service';
import { ipService } from './ip.service';
import { proxmoxProvider } from './proxmox.provider';
import { auditService } from './audit.service';
import { ENV_CONFIG } from '../config/env.config';

export class ProvisioningService {
  /**
   * Helper: AES-256 Encryption for root passwords/credentials.
   * Credentials must NEVER be stored as plaintext in the database.
   */
  private encryptSecret(plainText: string): string {
    const key = crypto.scryptSync(ENV_CONFIG.ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Helper: AES-256 Decryption (Server internal only, never sent to frontend responses)
   */
  private decryptSecret(cipherText: string): string {
    try {
      const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
      const key = crypto.scryptSync(ENV_CONFIG.ENCRYPTION_KEY, 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      return '********';
    }
  }

  /**
   * Core Idempotent Provisioning Engine
   */
  public async provisionOrder(orderId: string, adminUserId: string): Promise<{ vps: VPS; order: Order }> {
    const orders = db.getOrders();
    const order = orders.find((o) => o.id === orderId);

    // 1. Verify order exists
    if (!order) {
      throw new Error(`Order '${orderId}' not found.`);
    }

    // 2. IDEMPOTENCY GUARD: If order has already been provisioned, return existing record without duplicate VM creation
    if (order.status === 'ACTIVE' && order.vpsId) {
      const existingVps = db.getVpsInstances().find((v) => v.id === order.vpsId);
      if (existingVps) {
        console.log(`[ProvisioningService] Idempotency guard triggered for order ${orderId}: returning existing VPS ${existingVps.id}`);
        return { vps: existingVps, order };
      }
    }

    // 3. Verify payment status is PAID or PREORDER_CONFIRMED
    if (order.status !== 'PAID' && order.status !== 'PREORDER_CONFIRMED' && order.status !== 'PROVISION_FAILED') {
      throw new Error(`Cannot provision order '${orderId}'. Current status is '${order.status}'. Order must be PAID or PREORDER_CONFIRMED.`);
    }

    // 4. Retrieve Customer and calculate final server-side resources
    const users = db.getUsers();
    const customer = users.find((u) => u.id === order.customerId);
    const isFoundingCustomer = customer?.isFoundingCustomer || order.isFoundingBonusApplied;

    const resources = resourceService.calculateResources(order.planId, isFoundingCustomer);
    const targetNodeId = ENV_CONFIG.PROXMOX_NODE;

    // 5. Create or retrieve ProvisioningJob
    let job = db.getProvisioningJobs().find((j) => j.orderId === orderId);
    if (!job) {
      job = {
        id: `job-${Date.now()}`,
        orderId,
        customerId: order.customerId,
        status: 'RUNNING',
        attemptCount: 1,
        startedAt: new Date().toISOString(),
      };
      db.getProvisioningJobs().push(job);
    } else {
      job.status = 'RUNNING';
      job.attemptCount += 1;
      job.lastAttemptAt = new Date().toISOString();
    }
    db.save();

    // 6. Capacity Check
    const capacityCheck = capacityService.checkCapacity(
      targetNodeId,
      resources.finalRamGB,
      resources.vcpu,
      resources.storageGB
    );

    if (!capacityCheck.allowed) {
      order.status = 'PROVISION_FAILED';
      job.status = 'FAILED';
      job.errorMessage = capacityCheck.reason;
      db.save();

      auditService.logAction(
        adminUserId,
        'admin',
        'PROVISION_FAILED_CAPACITY_EXCEEDED',
        orderId,
        undefined,
        { reason: capacityCheck.reason }
      );

      throw new Error(`Provisioning failed: ${capacityCheck.reason}`);
    }

    // 7. Claim Available IP Address from IP Pool
    let allocatedIpRecord;
    try {
      allocatedIpRecord = ipService.allocateIp(`temp-${orderId}`, targetNodeId);
    } catch (err: any) {
      order.status = 'PROVISION_FAILED';
      job.status = 'FAILED';
      job.errorMessage = err.message;
      db.save();
      throw err;
    }

    // 8. Generate Next Proxmox VM ID & Hostname
    const vpsList = db.getVpsInstances();
    const nextVmId = 100 + vpsList.length + 1;
    const vpsId = `KH-${String(nextVmId).padStart(4, '0')}`;
    const hostname = `vps-${vpsId.toLowerCase()}`;
    const generatedPassword = `Kryon#${crypto.randomBytes(6).toString('hex')}!`;
    const encryptedPassword = this.encryptSecret(generatedPassword);

    // 9. Update order to PROVISIONING
    order.status = 'PROVISIONING';
    db.save();

    // 10. Commit Capacity Allocation
    capacityService.allocateNodeResources(targetNodeId, resources.finalRamGB, resources.vcpu, resources.storageGB);

    // 11. Execute Proxmox API VM Creation
    try {
      const proxmoxResult = await proxmoxProvider.createVM({
        vmid: nextVmId,
        name: hostname,
        memoryMB: resources.finalRamGB * 1024,
        cores: resources.vcpu,
        diskGB: resources.storageGB,
        osTemplate: 'ubuntu-24.04-lts',
        net0: 'virtio,bridge=vmbr0',
        ipConfig0: `ip=${allocatedIpRecord.ipAddress}/24,gw=103.189.200.1`,
      }, targetNodeId);

      if (!proxmoxResult.success) {
        throw new Error('Proxmox API reported VM creation failure');
      }

      // 12. Create VPS Record upon verified success
      const newVps: VPS = {
        id: vpsId,
        customerId: order.customerId,
        orderId: order.id,
        planId: order.planId,
        proxmoxNode: targetNodeId,
        proxmoxVmId: nextVmId,
        hostname,
        ramGB: resources.finalRamGB,
        vcpu: resources.vcpu,
        storageGB: resources.storageGB,
        ipv4: allocatedIpRecord.ipAddress,
        osTemplate: 'ubuntu-24.04-lts',
        status: 'ACTIVE',
        encryptedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provisionedAt: new Date().toISOString(),
      };

      // 13. Update IP Record & Order Status to ACTIVE
      allocatedIpRecord.vpsId = newVps.id;
      order.status = 'ACTIVE';
      order.vpsId = newVps.id;
      order.updatedAt = new Date().toISOString();

      job.status = 'SUCCESS';
      job.completedAt = new Date().toISOString();

      vpsList.push(newVps);
      db.save();

      // 14. Log Audit Entry
      auditService.logAction(
        adminUserId,
        'admin',
        'PROVISION_VPS_SUCCESS',
        newVps.id,
        nextVmId,
        {
          orderId,
          planId: order.planId,
          ramGB: resources.finalRamGB,
          vcpu: resources.vcpu,
          storageGB: resources.storageGB,
          ip: allocatedIpRecord.ipAddress,
        }
      );

      console.log(`[ProvisioningService] VPS ${newVps.id} (VM ID ${nextVmId}) provisioned successfully for order ${orderId}!`);

      return { vps: newVps, order };
    } catch (err: any) {
      // 15. Rollback on failure
      console.error(`[ProvisioningService] Provisioning failed for order ${orderId}: ${err.message}`);

      ipService.releaseIp(`temp-${orderId}`);
      capacityService.releaseNodeResources(targetNodeId, resources.finalRamGB, resources.vcpu, resources.storageGB);

      order.status = 'PROVISION_FAILED';
      job.status = 'FAILED';
      job.errorMessage = err.message;
      db.save();

      auditService.logAction(
        adminUserId,
        'admin',
        'PROVISION_VPS_FAILED',
        orderId,
        nextVmId,
        { error: err.message }
      );

      throw err;
    }
  }

  /**
   * Terminate VPS & Release Resources
   */
  public async terminateVps(vpsId: string, adminUserId: string): Promise<boolean> {
    const vpsList = db.getVpsInstances();
    const vps = vpsList.find((v) => v.id === vpsId);

    if (!vps) {
      throw new Error(`VPS '${vpsId}' not found.`);
    }

    // Call Proxmox API Delete
    await proxmoxProvider.deleteVM(vps.proxmoxVmId, vps.proxmoxNode);

    // Release IP & Capacity
    ipService.releaseIp(vps.id);
    capacityService.releaseNodeResources(vps.proxmoxNode, vps.ramGB, vps.vcpu, vps.storageGB);

    // Update VPS & Order status
    vps.status = 'TERMINATED';
    vps.updatedAt = new Date().toISOString();

    const order = db.getOrders().find((o) => o.id === vps.orderId);
    if (order) {
      order.status = 'TERMINATED';
      order.updatedAt = new Date().toISOString();
    }

    db.save();

    auditService.logAction(adminUserId, 'admin', 'TERMINATE_VPS', vps.id, vps.proxmoxVmId, {
      ip: vps.ipv4,
      node: vps.proxmoxNode,
    });

    return true;
  }
}

export const provisioningService = new ProvisioningService();
