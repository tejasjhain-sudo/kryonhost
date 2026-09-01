import { db } from '../repository/db';
import { provisioningService } from './provisioning.service';
import { ENV_CONFIG } from '../config/env.config';

export class QueueService {
  private isProcessing = false;

  constructor() {
    // If automatic mode is enabled, start queue listener
    if (ENV_CONFIG.PROVISIONING_MODE === 'automatic') {
      console.log('[QueueService] Automatic provisioning mode enabled. Worker active.');
      setInterval(() => this.processPendingQueue(), 10000);
    } else {
      console.log('[QueueService] Manual provisioning mode active. Pre-orders wait for admin approval.');
    }
  }

  /**
   * Process automatic provisioning queue
   */
  public async processPendingQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const orders = db.getOrders();
      const confirmedOrders = orders.filter((o) => o.status === 'PREORDER_CONFIRMED' || o.status === 'PAID');

      for (const order of confirmedOrders) {
        console.log(`[QueueService] Auto-provisioning queue picking up order ${order.id}...`);
        try {
          await provisioningService.provisionOrder(order.id, 'system-queue-worker');
        } catch (err: any) {
          console.error(`[QueueService] Auto-provisioning failed for order ${order.id}: ${err.message}`);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const queueService = new QueueService();
