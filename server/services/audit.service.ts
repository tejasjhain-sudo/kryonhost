import { db } from '../repository/db';
import { AuditLog, UserRole } from '../models/types';

export class AuditService {
  /**
   * Record security & administrative audit log entry
   */
  public logAction(
    actorId: string,
    actorRole: UserRole,
    action: string,
    targetId?: string,
    vmId?: number,
    metadata?: Record<string, any>,
    ipAddress?: string
  ): AuditLog {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId,
      actorRole,
      action,
      targetId,
      vmId,
      metadata,
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    db.getAuditLogs().push(log);
    db.save();

    console.log(`[AuditLog] ${actorRole.toUpperCase()} (${actorId}) -> ${action} | Target: ${targetId || 'N/A'} | VM: ${vmId || 'N/A'}`);
    return log;
  }

  public getLogs(): AuditLog[] {
    return db.getAuditLogs();
  }
}

export const auditService = new AuditService();
