export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PREORDER_CONFIRMED'
  | 'PROVISIONING'
  | 'ACTIVE'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'PROVISION_FAILED'
  | 'SUSPENDED'
  | 'TERMINATED';

export type ReservationStatus = 'RESERVED' | 'CANCELLED' | 'EXPIRED' | 'CONVERTED_TO_ORDER';

export type IpStatus = 'AVAILABLE' | 'ASSIGNED' | 'RESERVED' | 'BLOCKED';

export type VpsPowerStatus = 'running' | 'stopped' | 'rebooting' | 'unknown';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isFoundingCustomer: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  planId: string;
  datacenterLocation?: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  currency: 'USD' | 'INR';
  isFoundingBonusApplied: boolean;
  status: OrderStatus;
  paymentId?: string;
  paymentVerifiedAt?: string;
  vpsId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VPS {
  id: string; // e.g. KH-0101
  customerId: string;
  orderId: string;
  planId: string;
  proxmoxNode: string;
  proxmoxVmId: number;
  hostname: string;
  ramGB: number;
  vcpu: number;
  storageGB: number;
  ipv4: string;
  ipv6?: string;
  osTemplate: string;
  status: OrderStatus;
  encryptedPassword: string;
  createdAt: string;
  updatedAt: string;
  provisionedAt?: string;
}

export interface Reservation {
  reservationId: string; // e.g. KH-PRE-8921
  customerId: string;
  fullName: string;
  email: string;
  discordUsername: string;
  country: string;
  planId: string;
  planName: string;
  datacenterLocation: string; // e.g. "India - Mumbai"
  billingCycle?: string; // e.g. "12 Months (15% OFF)"
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  baseRamGB: number;
  bonusRamGB: number;
  finalRamGB: number;
  vcpu: number;
  storageGB: number;
  operatingSystem: string;
  intendedUse: string;
  intendedUseOther?: string;
  tellUsMore?: string;
  addonInterests: string[];
  phoneNumber?: string;
  company?: string;
  existingVpsProvider?: string;
  referralSource?: string;
  status: ReservationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IpAllocation {
  id: string;
  ipAddress: string;
  version: 'IPv4' | 'IPv6';
  status: IpStatus;
  vpsId?: string;
  nodeId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeCapacity {
  nodeId: string;
  nodeName: string;
  totalVcpu: number;
  allocatedVcpu: number;
  totalRamGB: number;
  hostReservedRamGB: number;
  allocatedRamGB: number;
  totalStorageGB: number;
  allocatedStorageGB: number;
}

export interface ProvisioningJob {
  id: string;
  orderId: string;
  customerId: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  attemptCount: number;
  lastAttemptAt?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  targetId?: string;
  vmId?: number;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}
