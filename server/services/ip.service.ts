import { db } from '../repository/db';
import { IpAllocation, IpStatus } from '../models/types';

export class IpService {
  /**
   * List all IP allocations in pool
   */
  public getAllIps(): IpAllocation[] {
    return db.getIpAllocations();
  }

  /**
   * Find and claim an AVAILABLE IPv4 address for a VPS.
   */
  public allocateIp(vpsId: string, nodeId: string): IpAllocation {
    const pool = db.getIpAllocations();
    const availableIp = pool.find((ip) => ip.status === 'AVAILABLE' && ip.nodeId === nodeId);

    if (!availableIp) {
      throw new Error(`No AVAILABLE IPv4 addresses remaining in pool for node '${nodeId}'.`);
    }

    availableIp.status = 'ASSIGNED';
    availableIp.vpsId = vpsId;
    availableIp.updatedAt = new Date().toISOString();

    db.save();
    console.log(`[IpService] Allocated IP ${availableIp.ipAddress} to VPS ${vpsId}`);
    return availableIp;
  }

  /**
   * Release IP address back to AVAILABLE pool upon VPS termination.
   */
  public releaseIp(vpsId: string): boolean {
    const pool = db.getIpAllocations();
    const ipRecord = pool.find((ip) => ip.vpsId === vpsId);

    if (ipRecord) {
      ipRecord.status = 'AVAILABLE';
      ipRecord.vpsId = undefined;
      ipRecord.updatedAt = new Date().toISOString();
      db.save();
      console.log(`[IpService] Released IP ${ipRecord.ipAddress} back to AVAILABLE pool.`);
      return true;
    }
    return false;
  }

  /**
   * Add new IP address to pool (Admin)
   */
  public addIpToPool(ipAddress: string, nodeId: string, version: 'IPv4' | 'IPv6' = 'IPv4', notes?: string): IpAllocation {
    const pool = db.getIpAllocations();
    const exists = pool.find((ip) => ip.ipAddress === ipAddress);

    if (exists) {
      throw new Error(`IP address ${ipAddress} already exists in pool.`);
    }

    const newIp: IpAllocation = {
      id: `ip-${Date.now()}`,
      ipAddress,
      version,
      status: 'AVAILABLE',
      nodeId,
      notes: notes || 'Admin added to pool',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pool.push(newIp);
    db.save();
    return newIp;
  }
}

export const ipService = new IpService();
