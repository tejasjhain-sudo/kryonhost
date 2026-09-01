import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { requireCustomer } from '../middleware/auth.middleware';

const router = Router();

// Apply Customer Auth Guard across all customer endpoints
router.use(requireCustomer);

router.get('/vps', (req, res) => customerController.getMyVpsList(req, res));
router.get('/vps/:id', (req, res) => customerController.getMyVpsById(req, res));
router.get('/vps/:id/status', (req, res) => customerController.getMyVpsStatus(req, res));

export default router;
