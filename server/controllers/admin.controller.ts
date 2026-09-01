import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../repository/db';
import { provisioningService } from '../services/provisioning.service';
import { capacityService } from '../services/capacity.service';
import { ipService } from '../services/ip.service';
import { proxmoxProvider } from '../services/proxmox.provider';
import { auditService } from '../services/audit.service';
import { ENV_CONFIG } from '../config/env.config';

export class AdminController {
  /**
   * POST /api/admin/orders/:id/provision
   */
  public async provisionOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = req.params.id;
      const adminUserId = req.user?.id || 'usr-admin-01';

      const result = await provisioningService.provisionOrder(orderId, adminUserId);
      return res.status(200).json({
        message: 'VPS provisioning completed successfully.',
        orderId: result.order.id,
        orderStatus: result.order.status,
        vps: {
          vpsId: result.vps.id,
          hostname: result.vps.hostname,
          ramGB: result.vps.ramGB,
          vcpu: result.vps.vcpu,
          storageGB: result.vps.storageGB,
          ipv4: result.vps.ipv4,
          proxmoxNode: result.vps.proxmoxNode,
          proxmoxVmId: result.vps.proxmoxVmId,
          status: result.vps.status,
          provisionedAt: result.vps.provisionedAt,
        },
      });
    } catch (err: any) {
      return res.status(400).json({
        error: 'Provisioning Error',
        message: err.message,
      });
    }
  }

  /**
   * GET /api/admin/vps
   */
  public async getAllVps(req: AuthenticatedRequest, res: Response) {
    const vpsList = db.getVpsInstances();
    const sanitizedList = vpsList.map((v) => ({
      vpsId: v.id,
      customerId: v.customerId,
      orderId: v.orderId,
      planId: v.planId,
      proxmoxNode: v.proxmoxNode,
      proxmoxVmId: v.proxmoxVmId,
      hostname: v.hostname,
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
   * GET /api/admin/vps/:id
   */
  public async getVpsById(req: AuthenticatedRequest, res: Response) {
    const vpsId = req.params.id;
    const vps = db.getVpsInstances().find((v) => v.id === vpsId || v.id.toLowerCase() === vpsId.toLowerCase());

    if (!vps) {
      return res.status(404).json({ error: 'Not Found', message: `VPS '${vpsId}' not found.` });
    }

    const liveStatus = await proxmoxProvider.getVMStatus(vps.proxmoxVmId, vps.proxmoxNode);

    return res.status(200).json({
      vps: {
        vpsId: vps.id,
        customerId: vps.customerId,
        orderId: vps.orderId,
        planId: vps.planId,
        proxmoxNode: vps.proxmoxNode,
        proxmoxVmId: vps.proxmoxVmId,
        hostname: vps.hostname,
        ramGB: vps.ramGB,
        vcpu: vps.vcpu,
        storageGB: vps.storageGB,
        ipv4: vps.ipv4,
        osTemplate: vps.osTemplate,
        status: vps.status,
        createdAt: vps.createdAt,
        provisionedAt: vps.provisionedAt,
        liveStatus,
      },
    });
  }

  /**
   * POST /api/admin/vps/:id/start
   */
  public async startVps(req: AuthenticatedRequest, res: Response) {
    const vpsId = req.params.id;
    const vps = db.getVpsInstances().find((v) => v.id === vpsId);
    if (!vps) return res.status(404).json({ error: 'Not Found', message: `VPS '${vpsId}' not found.` });

    await proxmoxProvider.startVM(vps.proxmoxVmId, vps.proxmoxNode);
    auditService.logAction(req.user?.id || 'admin', 'admin', 'START_VPS', vps.id, vps.proxmoxVmId);

    return res.status(200).json({ message: `VM ${vps.proxmoxVmId} start command sent.`, vpsId: vps.id });
  }

  /**
   * POST /api/admin/vps/:id/stop
   */
  public async stopVps(req: AuthenticatedRequest, res: Response) {
    const vpsId = req.params.id;
    const vps = db.getVpsInstances().find((v) => v.id === vpsId);
    if (!vps) return res.status(404).json({ error: 'Not Found', message: `VPS '${vpsId}' not found.` });

    await proxmoxProvider.stopVM(vps.proxmoxVmId, vps.proxmoxNode);
    auditService.logAction(req.user?.id || 'admin', 'admin', 'STOP_VPS', vps.id, vps.proxmoxVmId);

    return res.status(200).json({ message: `VM ${vps.proxmoxVmId} stop command sent.`, vpsId: vps.id });
  }

  /**
   * POST /api/admin/vps/:id/restart
   */
  public async restartVps(req: AuthenticatedRequest, res: Response) {
    const vpsId = req.params.id;
    const vps = db.getVpsInstances().find((v) => v.id === vpsId);
    if (!vps) return res.status(404).json({ error: 'Not Found', message: `VPS '${vpsId}' not found.` });

    await proxmoxProvider.restartVM(vps.proxmoxVmId, vps.proxmoxNode);
    auditService.logAction(req.user?.id || 'admin', 'admin', 'RESTART_VPS', vps.id, vps.proxmoxVmId);

    return res.status(200).json({ message: `VM ${vps.proxmoxVmId} reboot command sent.`, vpsId: vps.id });
  }

  /**
   * POST /api/admin/vps/:id/reinstall
   */
  public async reinstallVps(req: AuthenticatedRequest, res: Response) {
    const vpsId = req.params.id;
    const { osTemplate } = req.body;
    const vps = db.getVpsInstances().find((v) => v.id === vpsId);
    if (!vps) return res.status(404).json({ error: 'Not Found', message: `VPS '${vpsId}' not found.` });

    if (osTemplate) vps.osTemplate = osTemplate;
    vps.updatedAt = new Date().toISOString();
    db.save();

    auditService.logAction(req.user?.id || 'admin', 'admin', 'REINSTALL_VPS_OS', vps.id, vps.proxmoxVmId, { osTemplate: vps.osTemplate });

    return res.status(200).json({ message: `Reinstall initialized with OS template '${vps.osTemplate}'.`, vpsId: vps.id });
  }

  /**
   * POST /api/admin/vps/:id/terminate
   */
  public async terminateVps(req: AuthenticatedRequest, res: Response) {
    try {
      const vpsId = req.params.id;
      const adminUserId = req.user?.id || 'usr-admin-01';

      await provisioningService.terminateVps(vpsId, adminUserId);
      return res.status(200).json({ message: `VPS '${vpsId}' terminated and IP released successfully.` });
    } catch (err: any) {
      return res.status(400).json({ error: 'Termination Error', message: err.message });
    }
  }

  /**
   * GET /api/admin/proxmox/status
   */
  public async getProxmoxStatus(req: AuthenticatedRequest, res: Response) {
    const nodes = await proxmoxProvider.getNodes();
    const nodeStatus = await proxmoxProvider.getNodeStatus(ENV_CONFIG.PROXMOX_NODE);

    return res.status(200).json({
      clusterNodes: nodes,
      currentNode: nodeStatus,
      provisioningMode: ENV_CONFIG.PROVISIONING_MODE,
    });
  }

  /**
   * GET /api/admin/capacity
   */
  public async getCapacityStats(req: AuthenticatedRequest, res: Response) {
    const capacity = capacityService.getNodeCapacity(ENV_CONFIG.PROXMOX_NODE);
    return res.status(200).json({ capacity });
  }

  /**
   * GET /api/admin/ip-pool
   */
  public async getIpPool(req: AuthenticatedRequest, res: Response) {
    const pool = ipService.getAllIps();
    return res.status(200).json({ count: pool.length, pool });
  }

  /**
   * POST /api/admin/ip-pool
   */
  public async addIpToPool(req: AuthenticatedRequest, res: Response) {
    try {
      const { ipAddress, version, notes } = req.body;
      if (!ipAddress) return res.status(400).json({ error: 'Bad Request', message: 'ipAddress is required.' });

      const newIp = ipService.addIpToPool(ipAddress, ENV_CONFIG.PROXMOX_NODE, version || 'IPv4', notes);
      auditService.logAction(req.user?.id || 'admin', 'admin', 'ADD_IP_TO_POOL', newIp.id, undefined, { ip: ipAddress });

      return res.status(201).json({ message: `IP ${ipAddress} added to pool.`, ip: newIp });
    } catch (err: any) {
      return res.status(400).json({ error: 'IP Add Error', message: err.message });
    }
  }

  // =========================================================================
  // RESERVATION MANAGEMENT & ANALYTICS ENDPOINTS
  // =========================================================================

  /**
   * GET /api/admin/reservations
   * Search, filter by plan, country, intended use, status.
   */
  public async getReservations(req: AuthenticatedRequest, res: Response) {
    const { search, plan, country, intendedUse, status } = req.query;
    let reservations = db.getReservations();

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      reservations = reservations.filter(
        (r) =>
          r.reservationId.toLowerCase().includes(s) ||
          r.fullName.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.discordUsername.toLowerCase().includes(s)
      );
    }

    if (plan && typeof plan === 'string') {
      reservations = reservations.filter((r) => r.planId.toLowerCase() === plan.toLowerCase());
    }

    if (country && typeof country === 'string') {
      reservations = reservations.filter((r) => r.country.toLowerCase() === country.toLowerCase());
    }

    if (intendedUse && typeof intendedUse === 'string') {
      reservations = reservations.filter((r) => r.intendedUse.toLowerCase() === intendedUse.toLowerCase());
    }

    if (status && typeof status === 'string') {
      reservations = reservations.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    return res.status(200).json({ count: reservations.length, reservations });
  }

  /**
   * GET /api/admin/reservations/dashboard-stats
   * Includes Potential MRR calculation (clearly labeled as Potential MRR).
   */
  public async getReservationStats(req: AuthenticatedRequest, res: Response) {
    const reservations = db.getReservations();
    const allocationStats = db.getAllocationStats();

    const activeReservations = reservations.filter((r) => r.status === 'RESERVED');

    // Potential Monthly Recurring Revenue Calculation
    const potentialMrrUSD = activeReservations.reduce((sum, r) => sum + r.monthlyPriceUSD, 0);
    const potentialMrrINR = activeReservations.reduce((sum, r) => sum + r.monthlyPriceINR, 0);

    // Breakdown by Plan
    const byPlan: Record<string, number> = {};
    activeReservations.forEach((r) => {
      byPlan[r.planName] = (byPlan[r.planName] || 0) + 1;
    });

    // Breakdown by Country
    const byCountry: Record<string, number> = {};
    activeReservations.forEach((r) => {
      byCountry[r.country] = (byCountry[r.country] || 0) + 1;
    });

    // Breakdown by Intended Use
    const byIntendedUse: Record<string, number> = {};
    activeReservations.forEach((r) => {
      byIntendedUse[r.intendedUse] = (byIntendedUse[r.intendedUse] || 0) + 1;
    });

    return res.status(200).json({
      totalReservations: reservations.length,
      activeReservationsCount: activeReservations.length,
      foundingAllocationsClaimed: allocationStats.claimedCount,
      foundingAllocationsRemaining: allocationStats.remainingCount,
      totalFoundingAllocations: allocationStats.totalAllocations,
      potentialMRR: {
        usd: `$${potentialMrrUSD.toFixed(2)}/mo`,
        inr: `₹${potentialMrrINR.toLocaleString('en-IN')}/mo`,
        label: 'Potential Monthly Recurring Revenue (NOT actual revenue)',
      },
      breakdowns: {
        byPlan,
        byCountry,
        byIntendedUse,
      },
    });
  }

  /**
   * GET /api/admin/reservations/export-csv
   * Export all pre-order reservations to downloadable CSV file.
   */
  public async exportReservationsCSV(req: AuthenticatedRequest, res: Response) {
    const reservations = db.getReservations();

    const headers = [
      'Reservation ID',
      'Full Name',
      'Email',
      'Discord',
      'Country',
      'Plan Name',
      'Final RAM (GB)',
      'Bonus RAM (GB)',
      'vCPU',
      'Storage (GB)',
      'Operating System',
      'Intended Use',
      'Addon Interests',
      'Price USD',
      'Price INR',
      'Status',
      'Created At',
    ];

    const rows = reservations.map((r) => [
      r.reservationId,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.discordUsername,
      `"${r.country}"`,
      r.planName,
      r.finalRamGB,
      r.bonusRamGB,
      r.vcpu,
      r.storageGB,
      `"${r.operatingSystem}"`,
      `"${r.intendedUse}"`,
      `"${r.addonInterests.join(', ')}"`,
      `$${r.monthlyPriceUSD.toFixed(2)}`,
      `₹${r.monthlyPriceINR}`,
      r.status,
      r.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="kryonhost_preorder_reservations.csv"');
    return res.status(200).send(csvContent);
  }

  /**
   * POST /api/admin/reservations/:id/notes
   * Add internal admin notes to reservation
   */
  public async addReservationNote(req: AuthenticatedRequest, res: Response) {
    const reservationId = req.params.id;
    const { note } = req.body;

    const reservation = db.getReservations().find((r) => r.reservationId === reservationId);
    if (!reservation) return res.status(404).json({ error: 'Not Found', message: `Reservation '${reservationId}' not found.` });

    reservation.adminNotes = note;
    reservation.updatedAt = new Date().toISOString();
    db.save();

    auditService.logAction(req.user?.id || 'admin', 'admin', 'ADD_RESERVATION_NOTE', reservationId, undefined, { note });

    return res.status(200).json({ message: 'Admin note updated successfully.', reservation });
  }

  /**
   * POST /api/admin/reservations/:id/cancel
   */
  public async cancelReservation(req: AuthenticatedRequest, res: Response) {
    const reservationId = req.params.id;
    const reservation = db.getReservations().find((r) => r.reservationId === reservationId);
    if (!reservation) return res.status(404).json({ error: 'Not Found', message: `Reservation '${reservationId}' not found.` });

    reservation.status = 'CANCELLED';
    reservation.updatedAt = new Date().toISOString();
    db.save();

    auditService.logAction(req.user?.id || 'admin', 'admin', 'CANCEL_RESERVATION', reservationId);

    return res.status(200).json({ message: `Reservation '${reservationId}' set to CANCELLED.`, reservation });
  }
}

export const adminController = new AdminController();
