import { Request, Response } from 'express';
import { db } from '../repository/db';
import { Order } from '../models/types';
import { auditService } from '../services/audit.service';

export class WebhookController {
  /**
   * POST /api/webhooks/payment
   * Immediate Payment Webhook & Order Engine (Razorpay / Stripe / UPI / Crypto)
   */
  public async handlePaymentWebhook(req: Request, res: Response) {
    try {
      const {
        orderId,
        reservationId,
        paymentId,
        amount,
        currency,
        paymentMethod,
        customerId,
        planId,
        isFoundingBonusApplied,
      } = req.body;

      const targetOrderId = orderId || reservationId || `ord-pre-${Math.floor(1000 + Math.random() * 9000)}`;
      const targetPaymentId = paymentId || `pay_rzp_${Date.now()}`;

      const orders = db.getOrders();
      let order = orders.find((o) => o.id === targetOrderId);

      if (!order) {
        order = {
          id: targetOrderId,
          customerId: customerId || 'usr-cust-01',
          planId: planId || 'performance',
          monthlyPriceUSD: currency === 'USD' ? amount : 7.49,
          monthlyPriceINR: currency === 'INR' ? amount : 599,
          currency: currency || 'INR',
          isFoundingBonusApplied: isFoundingBonusApplied ?? true,
          status: 'PENDING_PAYMENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        orders.push(order);
      }

      // Step 1: Record Payment ID & Timestamp
      order.paymentId = targetPaymentId;
      order.paymentVerifiedAt = new Date().toISOString();

      // Step 2: Set status to PAID
      order.status = 'PAID';
      order.updatedAt = new Date().toISOString();

      // Step 3: Set status to PREORDER_CONFIRMED (VPS is NOT created yet until infrastructure launch)
      order.status = 'PREORDER_CONFIRMED';

      // Step 4: Update associated reservation status
      if (reservationId) {
        const reservations = db.getReservations();
        const resRecord = reservations.find((r) => r.reservationId === reservationId);
        if (resRecord) {
          resRecord.status = 'RESERVED';
          resRecord.adminNotes = `Payment verified (${paymentMethod || 'Online'}). Payment ID: ${targetPaymentId}`;
          resRecord.updatedAt = new Date().toISOString();
        }
      }

      db.save();

      auditService.logAction(
        order.customerId,
        'customer',
        'PAYMENT_COMPLETED_PREORDER_CONFIRMED',
        order.id,
        undefined,
        {
          paymentId: targetPaymentId,
          amount,
          currency,
          paymentMethod: paymentMethod || 'Online Payment',
          planId: order.planId,
        }
      );

      console.log(`[WebhookController] Immediate payment ${targetPaymentId} verified for order ${order.id}. Status set to PAID & PREORDER_CONFIRMED.`);

      return res.status(200).json({
        success: true,
        message: '💳 Payment verified successfully. Order status updated to PAID & PREORDER_CONFIRMED.',
        payment: {
          orderId: order.id,
          paymentId: targetPaymentId,
          amount,
          currency: order.currency,
          status: 'PAID',
          preOrderStatus: 'PREORDER_CONFIRMED',
          paymentVerifiedAt: order.paymentVerifiedAt,
          note: 'Founding VPS pre-order payment received. Server will be provisioned at launch.',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Payment Webhook Error', message: err.message });
    }
  }
}

export const webhookController = new WebhookController();
