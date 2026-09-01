import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../repository/db';
import { proxmoxProvider } from '../services/proxmox.provider';

export class CustomerController {
  /**
   * GET /api/customer/vps
   * List customer's owned VPS instances ONLY.
   */
  public async getMyVpsList(req: AuthenticatedRequest, res: Response) {
    const customerId = req.user?.id || 'usr-cust-01';
    const allVps = db.getVpsInstances();

    // Strict Customer Ownership Filter
    const customerVps = allVps.filter((v) => v.customerId === customerId);

    const sanitizedList = customerVps.map((v) => ({
      vpsId: v.id,
      hostname: v.hostname,
      planId: v.planId,
      ramGB: v.ramGB,
      vcpu: v.vcpu,
      storageGB: v.storageGB,
      ipv4: v.ipv4,
      osTemplate: v.osTemplate,
      status: v.status,
      createdAt: v.createdAt,
      provisionedAt: v.provisionedAt,
    }));

    return res.status(200).json({ count: sanitizedList.length, vps: sanitizedList });
  }

  /**
   * GET /api/customer/vps/:id
   * Get customer VPS details (Hides internal node, Proxmox tokens, and secrets).
   */
  public async getMyVpsById(req: AuthenticatedRequest, res: Response) {
    const customerId = req.user?.id || 'usr-cust-01';
    const vpsId = req.params.id;

    const vps = db.getVpsInstances().find(
      (v) => (v.id === vpsId || v.id.toLowerCase() === vpsId.toLowerCase()) && v.customerId === customerId
    );

    if (!vps) {
      return res.status(404).json({
        error: 'Not Found',
        message: `VPS '${vpsId}' not found or does not belong to your account.`,
      });
    }

    return res.status(200).json({
      vps: {
        vpsId: vps.id,
        hostname: vps.hostname,
        planId: vps.planId,
        ramGB: vps.ramGB,
        vcpu: vps.vcpu,
        storageGB: vps.storageGB,
        ipv4: vps.ipv4,
        osTemplate: vps.osTemplate,
        status: vps.status,
        createdAt: vps.createdAt,
        provisionedAt: vps.provisionedAt,
      },
    });
  }

  /**
   * GET /api/customer/vps/:id/status
   * Live power status query for customer's owned VPS.
   */
  public async getMyVpsStatus(req: AuthenticatedRequest, res: Response) {
    const customerId = req.user?.id || 'usr-cust-01';
    const vpsId = req.params.id;

    const vps = db.getVpsInstances().find(
      (v) => (v.id === vpsId || v.id.toLowerCase() === vpsId.toLowerCase()) && v.customerId === customerId
    );

    if (!vps) {
      return res.status(404).json({
        error: 'Not Found',
        message: `VPS '${vpsId}' not found or does not belong to your account.`,
      });
    }

    const liveStatus = await proxmoxProvider.getVMStatus(vps.proxmoxVmId, vps.proxmoxNode);

    return res.status(200).json({
      vpsId: vps.id,
      status: vps.status,
      powerState: liveStatus.status,
      cpuUsage: `${(liveStatus.cpu * 100).toFixed(1)}%`,
      memoryUsageMB: `${liveStatus.memMB} / ${liveStatus.maxmemMB} MB`,
      uptimeSeconds: liveStatus.uptimeSeconds,
    });
  }
}

export const customerController = new CustomerController();
