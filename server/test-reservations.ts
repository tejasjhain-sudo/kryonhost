import { db } from './repository/db';
import { preOrderController } from './controllers/preorder.controller';
import { adminController } from './controllers/admin.controller';

async function runReservationTestSuite() {
  console.log('================================================================');
  console.log(' RUNNING KRYONHOST PRE-ORDER RESERVATION & ANALYTICS TEST SUITE ');
  console.log('================================================================');

  // TEST 1: Backend Allocation Status Counter
  console.log('\n[TEST 1] Testing Backend-Controlled Allocation Counter:');
  const initialStats = db.getAllocationStats();
  console.log('Initial Allocation Stats:', initialStats);
  if (typeof initialStats.claimedCount !== 'number' || typeof initialStats.remainingCount !== 'number') {
    throw new Error('Allocation stats counter format error');
  }

  // TEST 2: Reserve New Founding Allocation (Zero Payment Required Today)
  console.log('\n[TEST 2] Testing Pre-Order Reservation Creation API:');
  const uniqueEmail = `marcus.${Date.now()}@example.com`;
  const mockReq = {
    body: {
      fullName: 'Marcus Vance',
      email: uniqueEmail,
      discordUsername: 'marcus_v',
      country: 'India',
      planId: 'performance', // 8GB RAM + 4GB Bonus = 12GB RAM, 4 vCPU, 100GB NVMe
      intendedUse: 'AI / ML',
      operatingSystem: 'Ubuntu 24.04',
      tellUsMore: 'Running AI model inference microservices',
      addonInterests: ['Automated Backups', 'Extra NVMe Storage'],
      phoneNumber: '+91 91234 56789',
      company: 'Vance AI Labs',
      confirmationAgreed: true,
    },
  } as any;

  let createdReservation: any = null;
  const mockRes = {
    status: (code: number) => ({
      json: (data: any) => {
        if (code === 201) {
          createdReservation = data.reservation;
          console.log(`Reservation Created Successfully (HTTP ${code}):`, data);
        } else {
          console.error(`Reservation Failed (HTTP ${code}):`, data);
        }
      },
    }),
  } as any;

  await preOrderController.createReservation(mockReq, mockRes);
  if (!createdReservation) throw new Error('Failed to create pre-order reservation');

  // TEST 3: Verify Allocation Decrement
  console.log('\n[TEST 3] Verifying Backend Allocation Counter Decrement:');
  const updatedStats = db.getAllocationStats();
  console.log('Updated Allocation Stats:', updatedStats);
  if (updatedStats.claimedCount !== initialStats.claimedCount + 1) {
    throw new Error('Allocation count did not increment after valid reservation');
  }

  // TEST 4: Admin Reservation Search & Filter API
  console.log('\n[TEST 4] Testing Admin Reservation List & Search API:');
  let adminList: any = null;
  const adminReq = { query: { search: uniqueEmail }, user: { role: 'admin' } } as any;
  const adminRes = {
    status: (code: number) => ({
      json: (data: any) => {
        adminList = data.reservations;
      },
    }),
  } as any;

  await adminController.getReservations(adminReq, adminRes);
  console.log(`Found ${adminList.length} matching reservation(s) for '${uniqueEmail}':`, adminList[0]?.reservationId);
  if (adminList.length < 1 || adminList[0].email !== uniqueEmail) {
    throw new Error('Admin reservation search failed');
  }

  // TEST 5: Potential MRR Dashboard Analytics API
  console.log('\n[TEST 5] Testing Potential MRR Dashboard Analytics:');
  let statsData: any = null;
  const statsReq = { query: {}, user: { role: 'admin' } } as any;
  const statsRes = {
    status: (code: number) => ({
      json: (data: any) => {
        statsData = data;
      },
    }),
  } as any;

  await adminController.getReservationStats(statsReq, statsRes);
  console.log('Dashboard Analytics Stats:', statsData);
  if (!statsData.potentialMRR || !statsData.potentialMRR.inr) {
    throw new Error('Dashboard stats missing Potential MRR calculation');
  }

  // TEST 6: CSV Export Generation API
  console.log('\n[TEST 6] Testing Admin CSV Export Generator:');
  let csvOutput = '';
  let headersSet: any = {};
  const csvReq = { user: { role: 'admin' } } as any;
  const csvRes = {
    setHeader: (k: string, v: string) => {
      headersSet[k] = v;
    },
    status: (code: number) => ({
      send: (content: string) => {
        csvOutput = content;
      },
    }),
  } as any;

  await adminController.exportReservationsCSV(csvReq, csvRes);
  console.log('CSV Header:', headersSet);
  console.log('CSV Content Snippet (First 3 lines):\n' + csvOutput.split('\n').slice(0, 3).join('\n'));

  if (!csvOutput.includes('Reservation ID,Full Name,Email') || !csvOutput.includes('KH-PRE-')) {
    throw new Error('CSV Export generation failed');
  }

  console.log('\n================================================================');
  console.log(' ALL KRYONHOST RESERVATION & ANALYTICS TESTS PASSED!            ');
  console.log('================================================================\n');
}

runReservationTestSuite().catch((err) => {
  console.error('FAILED RESERVATION TEST SUITE:', err);
  process.exit(1);
});
