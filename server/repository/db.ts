import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Order, VPS, Reservation, IpAllocation, NodeCapacity, ProvisioningJob, AuditLog } from '../models/types';
import { ENV_CONFIG } from '../config/env.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'kryonhost_db.json');

interface DatabaseSchema {
  users: User[];
  orders: Order[];
  vpsInstances: VPS[];
  reservations: Reservation[];
  ipAllocations: IpAllocation[];
  nodeCapacities: NodeCapacity[];
  provisioningJobs: ProvisioningJob[];
  auditLogs: AuditLog[];
  config: {
    totalFoundingAllocations: number;
    foundingBonusRamGB: number;
  };
}

class DatabaseService {
  private data: DatabaseSchema = {
    users: [],
    orders: [],
    vpsInstances: [],
    reservations: [],
    ipAllocations: [],
    nodeCapacities: [],
    provisioningJobs: [],
    auditLogs: [],
    config: {
      totalFoundingAllocations: 30,
      foundingBonusRamGB: 4,
    },
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileData = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileData);
        if (!this.data.reservations) this.data.reservations = [];
        if (!this.data.config) {
          this.data.config = { totalFoundingAllocations: 30, foundingBonusRamGB: 4 };
        } else {
          this.data.config.totalFoundingAllocations = 30;
        }
      } catch (err) {
        console.error('Error reading database file, initializing fresh schema:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  private seedInitialData() {
    // 1. Initial Users
    this.data.users = [
      {
        id: 'usr-admin-01',
        email: 'admin@kryonhost.com',
        fullName: 'KryonHost Infrastructure Admin',
        role: 'admin',
        isFoundingCustomer: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-cust-01',
        email: 'founding.dev@example.com',
        fullName: 'Alex Mercer',
        role: 'customer',
        isFoundingCustomer: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // 2. Initial Node Capacity
    this.data.nodeCapacities = [
      {
        nodeId: ENV_CONFIG.INITIAL_NODE.NODE_ID,
        nodeName: ENV_CONFIG.INITIAL_NODE.NODE_NAME,
        totalVcpu: ENV_CONFIG.INITIAL_NODE.TOTAL_VCPU,
        allocatedVcpu: 0,
        totalRamGB: ENV_CONFIG.INITIAL_NODE.TOTAL_RAM_GB,
        hostReservedRamGB: ENV_CONFIG.INITIAL_NODE.HOST_RESERVED_RAM_GB,
        allocatedRamGB: 0,
        totalStorageGB: ENV_CONFIG.INITIAL_NODE.TOTAL_STORAGE_GB,
        allocatedStorageGB: 0,
      },
    ];

    // 3. Initial IP Address Pool
    const initialIps = [
      '103.189.200.10',
      '103.189.200.11',
      '103.189.200.12',
      '103.189.200.13',
      '103.189.200.14',
      '103.189.200.15',
      '103.189.200.16',
      '103.189.200.17',
      '103.189.200.18',
      '103.189.200.19',
      '103.189.200.20',
    ];

    this.data.ipAllocations = initialIps.map((ip, idx) => ({
      id: `ip-${idx + 1}`,
      ipAddress: ip,
      version: 'IPv4',
      status: 'AVAILABLE',
      nodeId: ENV_CONFIG.INITIAL_NODE.NODE_ID,
      notes: 'India - Mumbai Datacenter Subnet A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // 4. Sample Pre-orders for Testing
    this.data.orders = [];

    // 5. Initial EXACT 2 Pre-Order Reservations Done out of 30
    this.data.reservations = [
      {
        reservationId: 'KH-PRE-8921',
        customerId: 'usr-cust-01',
        fullName: 'Alex Mercer',
        email: 'founding.dev@example.com',
        discordUsername: 'alex_mercer',
        country: 'India',
        planId: 'performance',
        planName: 'Performance',
        datacenterLocation: 'India - Mumbai',
        monthlyPriceUSD: 7.49,
        monthlyPriceINR: 599,
        baseRamGB: 8,
        bonusRamGB: 4,
        finalRamGB: 12,
        vcpu: 4,
        storageGB: 100,
        operatingSystem: 'Ubuntu 24.04',
        intendedUse: 'Docker / Containers',
        tellUsMore: 'Running production microservices',
        addonInterests: ['Automated Backups'],
        status: 'RESERVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        reservationId: 'KH-PRE-1042',
        customerId: 'usr-cust-02',
        fullName: 'David Vance',
        email: 'david.vance@example.com',
        discordUsername: 'david_v',
        country: 'India',
        planId: 'pro',
        planName: 'Pro',
        datacenterLocation: 'India - Mumbai',
        monthlyPriceUSD: 12.49,
        monthlyPriceINR: 999,
        baseRamGB: 16,
        bonusRamGB: 4,
        finalRamGB: 20,
        vcpu: 6,
        storageGB: 200,
        operatingSystem: 'Debian 12',
        intendedUse: 'Database',
        addonInterests: ['Extra NVMe Storage'],
        status: 'RESERVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data.config = {
      totalFoundingAllocations: 30,
      foundingBonusRamGB: 4,
    };

    this.save();
  }

  // Getters & Mutators
  public getUsers() {
    return this.data.users;
  }

  public getOrders() {
    return this.data.orders;
  }

  public getVpsInstances() {
    return this.data.vpsInstances;
  }

  public getReservations() {
    return this.data.reservations;
  }

  public getIpAllocations() {
    return this.data.ipAllocations;
  }

  public getNodeCapacities() {
    return this.data.nodeCapacities;
  }

  public getProvisioningJobs() {
    return this.data.provisioningJobs;
  }

  public getAuditLogs() {
    return this.data.auditLogs;
  }

  public getConfig() {
    return this.data.config;
  }

  /**
   * Real backend-controlled founding allocation counter.
   * Starts with 2 pre-orders done out of 30 (28 available).
   * Increments automatically whenever someone REALLY pays.
   */
  public getAllocationStats() {
    const activeReservations = this.data.reservations.filter((r) => r.status === 'RESERVED');
    const claimedCount = activeReservations.length;
    const totalAllocations = 30; // Exactly 30 total allocations
    const remainingCount = Math.max(0, totalAllocations - claimedCount);
    const isBonusActive = remainingCount > 0;

    return {
      totalAllocations,
      claimedCount,
      remainingCount,
      isBonusActive,
      foundingBonusRamGB: this.data.config.foundingBonusRamGB,
    };
  }
}

export const db = new DatabaseService();
