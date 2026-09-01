import express from 'express';
import cors from 'cors';
import { ENV_CONFIG } from './config/env.config';
import adminRoutes from './routes/admin.routes';
import customerRoutes from './routes/customer.routes';
import webhookRoutes from './routes/webhook.routes';
import preOrderRoutes from './routes/preorder.routes';
import { queueService } from './services/queue.service';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint (Used by UptimeRobot / Ping services to prevent sleep)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'KryonHost VPS Fulfillment & Provisioning Backend API',
    provisioningMode: ENV_CONFIG.PROVISIONING_MODE,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/preorder', preOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/webhooks', webhookRoutes);

// Optional: Automatic Self-Ping Keep-Alive Worker (Prevents Render Free Tier Sleeping)
const KEEP_ALIVE_URL = process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL;
if (KEEP_ALIVE_URL) {
  console.log(`[KeepAlive] Automatic self-ping worker activated for: ${KEEP_ALIVE_URL}`);
  setInterval(async () => {
    try {
      await fetch(`${KEEP_ALIVE_URL}/health`);
      console.log(`[KeepAlive] Pinged ${KEEP_ALIVE_URL}/health to prevent sleeping.`);
    } catch (err) {
      // Ignore transient network errors
    }
  }, 10 * 60 * 1000); // Ping every 10 minutes (Render sleeps after 15m)
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[KryonHost API Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

const PORT = ENV_CONFIG.PORT;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` KryonHost VPS Fulfillment API running on port ${PORT}`);
  console.log(` Mode: ${ENV_CONFIG.NODE_ENV} | Provisioning Mode: ${ENV_CONFIG.PROVISIONING_MODE}`);
  console.log(` Proxmox Node: ${ENV_CONFIG.PROXMOX_NODE} (${ENV_CONFIG.PROXMOX_HOST})`);
  console.log(`=======================================================`);
});

export default app;
