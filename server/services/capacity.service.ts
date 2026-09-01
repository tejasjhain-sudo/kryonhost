import { db } from '../repository/db';
import { NodeCapacity } from '../models/types';

export class CapacityService {
  /**
   * Get Capacity Statistics for a Proxmox Node
   */
  public getNodeCapacity(nodeId: string): NodeCapacity | undefined {
    const capacities = db.getNodeCapacities();
    return capacities.find((n) => n.nodeId === nodeId);
  }

  /**
   * Verify if Node has sufficient unallocated RAM, vCPU, and NVMe Storage.
   * Enforces HOST_RESERVED_RAM overhead reservation (e.g. 16 GB for host OS).
   */
  public checkCapacity(
    nodeId: string,
    requiredRamGB: number,
    requiredVcpu: number,
    requiredStorageGB: number
  ): { allowed: boolean; reason?: string; availableRamGB?: number; availableVcpu?: number; availableStorageGB?: number } {
    const node = this.getNodeCapacity(nodeId);

    if (!node) {
      return { allowed: false, reason: `Proxmox Node '${nodeId}' not registered in capacity system.` };
    }

    const allocatableRamGB = node.totalRamGB - node.hostReservedRamGB;
    const availableRamGB = allocatableRamGB - node.allocatedRamGB;
    const availableVcpu = node.totalVcpu * 4 - node.allocatedVcpu; // 4:1 vCPU overcommit ratio
    const availableStorageGB = node.totalStorageGB - node.allocatedStorageGB;

    if (requiredRamGB > availableRamGB) {
      return {
        allowed: false,
        reason: `Insufficient Node RAM. Required: ${requiredRamGB}GB, Allocatable Available: ${availableRamGB}GB (Total Node RAM: ${node.totalRamGB}GB, Reserved for Host: ${node.hostReservedRamGB}GB).`,
        availableRamGB,
        availableVcpu,
        availableStorageGB,
      };
    }

    if (requiredStorageGB > availableStorageGB) {
      return {
        allowed: false,
        reason: `Insufficient Node NVMe Storage. Required: ${requiredStorageGB}GB, Available: ${availableStorageGB}GB.`,
        availableRamGB,
        availableVcpu,
        availableStorageGB,
      };
    }

    return {
      allowed: true,
      availableRamGB,
      availableVcpu,
      availableStorageGB,
    };
  }

  /**
   * Commit Resource Allocation to Node
   */
  public allocateNodeResources(nodeId: string, ramGB: number, vcpu: number, storageGB: number): boolean {
    const node = this.getNodeCapacity(nodeId);
    if (!node) return false;

    node.allocatedRamGB += ramGB;
    node.allocatedVcpu += vcpu;
    node.allocatedStorageGB += storageGB;

    db.save();
    console.log(`[CapacityService] Allocated on ${nodeId}: +${ramGB}GB RAM, +${vcpu} vCPU, +${storageGB}GB NVMe. Total allocated RAM: ${node.allocatedRamGB}GB/${node.totalRamGB - node.hostReservedRamGB}GB`);
    return true;
  }

  /**
   * Release Resource Allocation on Node Termination
   */
  public releaseNodeResources(nodeId: string, ramGB: number, vcpu: number, storageGB: number): boolean {
    const node = this.getNodeCapacity(nodeId);
    if (!node) return false;

    node.allocatedRamGB = Math.max(0, node.allocatedRamGB - ramGB);
    node.allocatedVcpu = Math.max(0, node.allocatedVcpu - vcpu);
    node.allocatedStorageGB = Math.max(0, node.allocatedStorageGB - storageGB);

    db.save();
    console.log(`[CapacityService] Released on ${nodeId}: -${ramGB}GB RAM, -${vcpu} vCPU, -${storageGB}GB NVMe.`);
    return true;
  }
}

export const capacityService = new CapacityService();
