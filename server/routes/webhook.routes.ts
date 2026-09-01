import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

router.post('/payment', (req, res) => webhookController.handlePaymentWebhook(req, res));

export default router;
