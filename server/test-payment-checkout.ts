import { db } from './repository/db';
import { webhookController } from './controllers/webhook.controller';
import { preOrderController } from './controllers/preorder.controller';

async function runPaymentCheckoutTestSuite() {
  console.log('================================================================');
  console.log(' RUNNING IMMEDIATE ONLINE PAYMENT CHECKOUT TEST SUITE            ');
  console.log('================================================================');

  // TEST 1: Create Pre-Order Reservation
  console.log('\n[TEST 1] Creating Pre-Order Reservation:');
  const reservationId = `KH-PRE-PAY-${Math.floor(1000 + Math.random() * 9000)}`;
  const mockReqReserve = {
    body: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      discordUsername: 'elena_r',
      country: 'Germany',
      planId: 'performance', // 8GB RAM + 4GB Bonus = 12GB RAM, ₹599/mo ($7.49/mo)
      intendedUse: 'Web Hosting',
      operatingSystem: 'Ubuntu 24.04',
      addonInterests: ['Automated Backups'],
      confirmationAgreed: true,
    },
  } as any;

  let reserveResult: any = null;
  const mockResReserve = {
    status: (code: number) => ({
      json: (data: any) => {
        reserveResult = data.reservation;
        console.log(`Reservation Created (HTTP ${code}):`, data.message);
      },
    }),
  } as any;

  await preOrderController.createReservation(mockReqReserve, mockResReserve);
  if (!reserveResult) throw new Error('Reservation creation failed');

  // TEST 2: Process Immediate Online Payment Webhook Payload
  console.log('\n[TEST 2] Processing Payment Webhook Payload (Immediate Checkout):');
  const mockReqPayment = {
    body: {
      orderId: reserveResult.reservationId,
      reservationId: reserveResult.reservationId,
      paymentId: `pay_rzp_live_${Date.now()}`,
      amount: 648, // ₹599 + ₹49 addon
      currency: 'INR',
      paymentMethod: 'UPI / GPay',
      customerId: reserveResult.customerId || 'usr-cust-elena',
      planId: 'performance',
      isFoundingBonusApplied: true,
    },
  } as any;

  let paymentResult: any = null;
  const mockResPayment = {
    status: (code: number) => ({
      json: (data: any) => {
        paymentResult = data.payment;
        console.log(`Payment Verified (HTTP ${code}):`, data);
      },
    }),
  } as any;

  await webhookController.handlePaymentWebhook(mockReqPayment, mockResPayment);
  if (!paymentResult || paymentResult.status !== 'PAID') {
    throw new Error('Payment webhook processing failed');
  }

  // TEST 3: Verify Order & Reservation State in Persistent Database
  console.log('\n[TEST 3] Verifying Order State in Persistent Database:');
  const orders = db.getOrders();
  const orderRecord = orders.find((o) => o.id === reserveResult.reservationId);
  console.log('Order Record in DB:', orderRecord);

  if (!orderRecord) throw new Error('Order record not found in database');
  if (orderRecord.status !== 'PREORDER_CONFIRMED' && orderRecord.status !== 'PAID') {
    throw new Error(`Order status error: expected PAID / PREORDER_CONFIRMED, got '${orderRecord.status}'`);
  }

  if (!orderRecord.paymentId || !orderRecord.paymentVerifiedAt) {
    throw new Error('Order record missing payment verification details');
  }

  console.log('\n================================================================');
  console.log(' ALL IMMEDIATE ONLINE PAYMENT CHECKOUT TESTS PASSED!             ');
  console.log('================================================================\n');
}

runPaymentCheckoutTestSuite().catch((err) => {
  console.error('FAILED PAYMENT CHECKOUT TEST SUITE:', err);
  process.exit(1);
});
