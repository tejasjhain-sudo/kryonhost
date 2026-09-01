import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Apply Admin Auth Guard across all admin endpoints
router.use(requireAdmin);

// Provisioning Trigger
router.post('/orders/:id/provision', (req, res) => adminController.provisionOrder(req, res));

// VPS List & Single View
router.get('/vps', (req, res) => adminController.getAllVps(req, res));
router.get('/vps/:id', (req, res) => adminController.getVpsById(req, res));

// Power Actions
router.post('/vps/:id/start', (req, res) => adminController.startVps(req, res));
router.post('/vps/:id/stop', (req, res) => adminController.stopVps(req, res));
router.post('/vps/:id/restart', (req, res) => adminController.restartVps(req, res));
router.post('/vps/:id/reinstall', (req, res) => adminController.reinstallVps(req, res));
router.post('/vps/:id/terminate', (req, res) => adminController.terminateVps(req, res));

// Proxmox Node & Infrastructure Capacity
router.get('/proxmox/status', (req, res) => adminController.getProxmoxStatus(req, res));
router.get('/capacity', (req, res) => adminController.getCapacityStats(req, res));

// IP Pool Management
router.get('/ip-pool', (req, res) => adminController.getIpPool(req, res));
router.post('/ip-pool', (req, res) => adminController.addIpToPool(req, res));

// Reservation Management & Analytics
router.get('/reservations', (req, res) => adminController.getReservations(req, res));
router.get('/reservations/dashboard-stats', (req, res) => adminController.getReservationStats(req, res));
router.get('/reservations/export-csv', (req, res) => adminController.exportReservationsCSV(req, res));
router.post('/reservations/:id/notes', (req, res) => adminController.addReservationNote(req, res));
router.post('/reservations/:id/cancel', (req, res) => adminController.cancelReservation(req, res));

export default router;
