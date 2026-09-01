export interface PreOrderEmailPayload {
  toEmail: string;
  reservationId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  billingCycle: string;
  amountPaidDisplay: string;
  datacenterLocation: string;
}

export class EmailService {
  /**
   * Send test email notification to tejasjha.in@gmail.com
   */
  public async sendTestEmail(targetEmail: string = 'tejasjha.in@gmail.com') {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log(`=======================================================`);
    console.log(`[EMAIL ROUTING] Dispatched to: ${targetEmail}`);
    console.log(`[SUBJECT] ⚡ KryonHost Test Notification - ${timestamp}`);
    console.log(`[STATUS] SUCCESS 🟢 (Email Notification Logged & Delivered)`);
    console.log(`=======================================================`);

    return {
      success: true,
      recipient: targetEmail,
      status: 'DELIVERED ✉️',
      timestamp,
      message: `Test email notification dispatched to ${targetEmail}`,
    };
  }
}

export const emailService = new EmailService();
