import { ENV_CONFIG } from './config/env.config';
import { db } from './repository/db';
import { resourceService } from './services/resource.service';
import { capacityService } from './services/capacity.service';
import { ipService } from './services/ip.service';
import { proxmoxProvider } from './services/proxmox.provider';
import { provisioningService } from './services/provisioning.service';
import { auditService } from './services/audit.service';

async function runFulfillmentTestSuite() {
  console.log('================================================================');
  console.log(' RUNNING KRYONHOST VPS FULFILLMENT & PROVISIONING SUITE         ');
  console.log('================================================================');

  // TEST 1: Resource Calculation & Founding Bonus Rule
  console.log('\n[TEST 1] Testing Server-Side Resource Calculator:');
  const performanceSpecs = resourceService.calculateResources('performance', true); // Founding customer
  console.log('Performance Plan + Founding Bonus:', performanceSpecs);
  if (performanceSpecs.finalRamGB !== 12) throw new Error('Resource calculator failed: expected 12GB RAM (8GB base + 4GB bonus)');

  const nanoSpecs = resourceService.calculateResources('nano', true); // Nano plan (bonus ineligible)
  console.log('Nano Plan Specs (Ineligible for Bonus):', nanoSpecs);
  if (nanoSpecs.finalRamGB !== 2) throw new Error('Resource calculator failed: Nano plan should be 2GB RAM');

  // TEST 2: Node Capacity & Host Reserved RAM Overhead Guard
  console.log('\n[TEST 2] Testing Node Capacity & Overhead Guard:');
  const capacityStats = capacityService.getNodeCapacity(ENV_CONFIG.PROXMOX_NODE);
  console.log('Initial Node Capacity:', capacityStats);

  const capacityCheck = capacityService.checkCapacity(ENV_CONFIG.PROXMOX_NODE, 12, 4, 100);
  console.log('Capacity Check Result:', capacityCheck);
  if (!capacityCheck.allowed) throw new Error('Capacity check failed on initial node');

  // TEST 3: IP Address Pool Allocation
  console.log('\n[TEST 3] Testing IP Pool Manager:');
  const initialIps = ipService.getAllIps();
  console.log(`Available IPs in Pool: ${initialIps.filter((i) => i.status === 'AVAILABLE').length}`);

  // TEST 4: Pre-Order Payment Webhook -> PREORDER_CONFIRMED (VPS NOT created yet!)
  console.log('\n[TEST 4] Testing Payment Webhook & Order State Machine:');
  const sampleOrder = db.getOrders()[0];
  console.log(`Order ${sampleOrder.id} status before admin trigger: ${sampleOrder.status}`);
  if (sampleOrder.status !== 'PREORDER_CONFIRMED') throw new Error('Order status should be PREORDER_CONFIRMED');

  const customerVpsBefore = db.getVpsInstances().filter((v) => v.customerId === sampleOrder.customerId);
  console.log(`Customer owned VPS count before admin provision trigger: ${customerVpsBefore.length}`);
  if (customerVpsBefore.length !== 0) throw new Error('VPS should NOT be created prior to admin provision trigger');

  // TEST 5: Admin Triggers Idempotent Provisioning
  console.log('\n[TEST 5] Admin Triggering Idempotent Provisioning:');
  const provisionResult = await provisioningService.provisionOrder(sampleOrder.id, 'usr-admin-01');
  console.log('Provisioning Completed Successfully!');
  console.log('Resulting Order Status:', provisionResult.order.status);
  console.log('Provisioned VPS Record:', provisionResult.vps);

  if (provisionResult.order.status !== 'ACTIVE') throw new Error('Order status should be ACTIVE after successful provisioning');
  if (provisionResult.vps.ramGB !== 12) throw new Error('Provisioned VPS should have 12GB RAM');
  if (provisionResult.vps.ipv4 !== '103.189.200.10') throw new Error('Provisioned VPS should have assigned IP 103.189.200.10');

  // TEST 6: Idempotency Enforcement (Re-provisioning the same order)
  console.log('\n[TEST 6] Testing Idempotency Enforcement (Duplicate Provisioning Request):');
  const retryResult = await provisioningService.provisionOrder(sampleOrder.id, 'usr-admin-01');
  console.log('Idempotent Retry Result VPS ID:', retryResult.vps.id);
  const totalVpsCount = db.getVpsInstances().length;
  console.log(`Total VPS instances created in DB: ${totalVpsCount}`);
  if (totalVpsCount !== 1) throw new Error('Idempotency check failed: created duplicate VPS records!');

  // TEST 7: Customer Ownership & Privacy Shield
  console.log('\n[TEST 7] Testing Customer Ownership & Secrets Privacy Shield:');
  const customerOwnedVps = db.getVpsInstances().find((v) => v.customerId === sampleOrder.customerId);
  if (!customerOwnedVps) throw new Error('Customer VPS record missing');

  // Verify Proxmox credentials are NOT plaintext in DB
  console.log('Encrypted Password in DB:', customerOwnedVps.encryptedPassword);
  if (customerOwnedVps.encryptedPassword.includes('Kryon#')) {
    throw new Error('Security vulnerability: credentials stored as plaintext in DB!');
  }

  // TEST 8: Audit Log Verification
  console.log('\n[TEST 8] Verifying Security Audit Logs:');
  const logs = auditService.getLogs();
  console.log(`Total Security Audit Log Entries: ${logs.length}`);
  logs.forEach((log) => console.log(`  - [${log.timestamp}] ${log.actorRole.toUpperCase()} (${log.actorId}): ${log.action} | Target: ${log.targetId}`));

  console.log('\n================================================================');
  console.log(' ALL KRYONHOST VPS FULFILLMENT & PROVISIONING TESTS PASSED!     ');
  console.log('================================================================\n');
}

runFulfillmentTestSuite().catch((err) => {
  console.error('\nFAILED FULFILLMENT TEST SUITE:', err);
  process.exit(1);
});
