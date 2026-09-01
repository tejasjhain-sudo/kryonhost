import { Router } from 'express';
import { preOrderController } from '../controllers/preorder.controller';

const router = Router();

// GET /api/preorder/allocation-status (Real backend-controlled counter)
router.get('/allocation-status', (req, res) => preOrderController.getAllocationStatus(req, res));

// POST /api/preorder/reserve (Submit pre-order reservation)
router.post('/reserve', (req, res) => preOrderController.createReservation(req, res));

// POST /api/preorder/test-email (Dispatch test notification to tejasjha.in@gmail.com)
router.post('/test-email', (req, res) => preOrderController.sendTestEmail(req, res));

export default router;
