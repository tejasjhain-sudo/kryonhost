import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const ENV_CONFIG = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Provisioning Mode: 'manual' (default for pre-launch) vs 'automatic'
  PROVISIONING_MODE: process.env.PROVISIONING_MODE || 'manual',

  // AES-256 Encryption key for VPS root passwords
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'kryonhost_secret_aes256_key_32bytes!!',

  // Proxmox VE Credentials (NEVER exposed to frontend)
  PROXMOX_HOST: process.env.PROXMOX_HOST || '10.0.0.100',
  PROXMOX_PORT: parseInt(process.env.PROXMOX_PORT || '8006', 10),
  PROXMOX_API_TOKEN_ID: process.env.PROXMOX_API_TOKEN_ID || 'root@pam!kryonhost_api',
  PROXMOX_API_TOKEN_SECRET: process.env.PROXMOX_API_TOKEN_SECRET || '89124a5b-9812-4567-8901-abcdef123456',
  PROXMOX_NODE: process.env.PROXMOX_NODE || 'pve-node-01',

  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://afygifqzaywmlfxnpzak.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeWdpZnF6YXl3bWxmeG5wemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTk5ODEsImV4cCI6MjEwMzgzNTk4MX0.ngVcI7o5QpuHr2p-5iqkXDBIJiCTp7UTgQnKqwdT4VM',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeWdpZnF6YXl3bWxmeG5wemFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI1OTk4MSwiZXhwIjoyMTAzODM1OTgxfQ.7e0l42RtBieKi2usFwOlJxYTBflRqdQjRTzjgI8g8NY',

  // Node Initial Allocation Config
  INITIAL_NODE: {
    NODE_ID: 'pve-node-01',
    NODE_NAME: 'Delhi NCR Node 1',
    TOTAL_VCPU: 32,
    TOTAL_RAM_GB: 128,
    HOST_RESERVED_RAM_GB: 16,
    TOTAL_STORAGE_GB: 1920,
  },
};
