export interface VPSPlan {
  id: string;
  name: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  vcpu: number;
  ramGB: number;
  storageNVMeGB: number;
  bandwidth: string;
  ipv4: string;
  virtualization: string;
  ddosProtection: string;
  popular?: boolean;
  badge?: string;
  description: string;
  bonusEligible?: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  priceINR: string;
  priceUSD: string;
  description: string;
  icon: string;
}

export interface DatacenterLocation {
  id: string;
  country: string;
  flag: string;
  city: string;
  status: string;
  statusColor: string;
  description: string;
  isConfirmed: boolean;
}

export interface SystemStatusItem {
  name: string;
  status: 'Operational' | 'Open' | 'Preparing' | 'Coming Soon';
  state: 'green' | 'yellow' | 'gray';
  detail: string;
}

export interface TechnicalSpecification {
  label: string;
  key: string;
  value: string;
  notes: string;
  isFinalized: boolean;
}

export const KRYONHOST_CONFIG = {
  brand: {
    name: 'KryonHost',
    domain: 'kryonhost.com',
    tagline: 'Powerful VPS. Built for What\'s Next.',
    subtext: 'High-performance VPS infrastructure built for developers, businesses, and demanding workloads.',
    stage: 'Pre-launch / Pre-orders',
    expectedLaunchWindow: 'Q4 2026',
    foundingBonusRamGB: 4,
    totalFoundingAllocations: 30,
    remainingFoundingAllocations: 28,
  },

  contact: {
    email: 'support@kryonhost.com',
    discordUrl: 'https://discord.gg/kryonhost',
    twitterUrl: 'https://x.com/kryonhost',
    githubUrl: 'https://github.com/kryonhost',
    instagramUrl: 'https://instagram.com/kryonhost',
  },

  // Datacenter Location (Strictly India - Mumbai)
  locations: [
    {
      id: 'in-mumbai',
      country: 'India',
      flag: '🇮🇳',
      city: 'Mumbai Datacenter',
      status: 'Primary Pre-Order Node',
      statusColor: 'bg-[#E0F2FE] text-[#0096C7] border-[#0096C7]/30',
      description: 'Our primary Tier IV datacenter facility located in Mumbai, India.',
      isConfirmed: true,
    },
  ] as DatacenterLocation[],

  // Centralized VPS Plans Configuration (5 Tiers)
  plans: [
    {
      id: 'nano',
      name: 'Nano',
      monthlyPriceUSD: 2.49,
      monthlyPriceINR: 199,
      vcpu: 1,
      ramGB: 2,
      storageNVMeGB: 25,
      bandwidth: '1 Gbps',
      ipv4: '1 Dedicated IPv4',
      virtualization: 'KVM',
      ddosProtection: 'Included',
      bonusEligible: false,
      description: 'Ideal for small apps, microservices, lightweight web servers, and dev environments.',
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPriceUSD: 4.29,
      monthlyPriceINR: 349,
      vcpu: 2,
      ramGB: 4,
      storageNVMeGB: 50,
      bandwidth: '1 Gbps',
      ipv4: '1 Dedicated IPv4',
      virtualization: 'KVM',
      ddosProtection: 'Included',
      bonusEligible: false,
      description: 'Balanced CPU and memory for medium production applications and APIs.',
    },
    {
      id: 'performance',
      name: 'Performance',
      monthlyPriceUSD: 7.49,
      monthlyPriceINR: 599,
      vcpu: 4,
      ramGB: 8,
      storageNVMeGB: 100,
      bandwidth: '1 Gbps',
      ipv4: '1 Dedicated IPv4',
      virtualization: 'KVM',
      ddosProtection: 'Included',
      popular: true,
      badge: 'MOST POPULAR',
      bonusEligible: true,
      description: 'High-density performance for demanding databases, container clusters, and heavy traffic.',
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPriceUSD: 12.49,
      monthlyPriceINR: 999,
      vcpu: 6,
      ramGB: 16,
      storageNVMeGB: 200,
      bandwidth: '1 Gbps',
      ipv4: '1 Dedicated IPv4',
      virtualization: 'KVM',
      ddosProtection: 'Included',
      bonusEligible: true,
      description: 'High compute power for memory-intensive applications and high-concurrency workloads.',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPriceUSD: 18.49,
      monthlyPriceINR: 1499,
      vcpu: 8,
      ramGB: 24,
      storageNVMeGB: 300,
      bandwidth: '1 Gbps',
      ipv4: '1 Dedicated IPv4',
      virtualization: 'KVM',
      ddosProtection: 'Included',
      badge: 'ENTERPRISE TIER',
      bonusEligible: true,
      description: 'Maximum capacity for mission-critical infrastructure, microservices clusters, and scale.',
    },
  ] as VPSPlan[],

  intendedUseOptions: [
    'Web Hosting',
    'Game Server',
    'Development',
    'Docker / Containers',
    'Database',
    'VPN',
    'Bot / Applications',
    'AI / ML',
    'Personal Projects',
    'Other',
  ],

  operatingSystems: [
    'Ubuntu 24.04',
    'Ubuntu 22.04',
    'Debian 13',
    'Debian 12',
    'AlmaLinux',
    'Rocky Linux',
    'Other',
  ],

  addonInterests: [
    'Automated Backups',
    'Extra NVMe Storage',
    'Additional IPv4',
    'Additional Backup Storage',
    'Managed VPS Support',
  ],

  addOns: [
    {
      id: 'daily-backups',
      name: 'Automated Daily Backups',
      priceINR: '₹49/mo',
      priceUSD: '$0.60/mo',
      description: 'Scheduled automated daily backups of instance state and storage volumes.',
      icon: 'Archive',
    },
    {
      id: 'backups-7day',
      name: 'Automated Backups — 7-Day Retention',
      priceINR: '₹99/mo',
      priceUSD: '$1.20/mo',
      description: 'Full 7-day rolling recovery points for disaster recovery peace of mind.',
      icon: 'RotateCw',
    },
    {
      id: 'extra-nvme',
      name: 'Extra 50 GB NVMe Storage',
      priceINR: '₹99/mo',
      priceUSD: '$1.20/mo',
      description: 'Expand your primary disk space with high-speed PCIe NVMe storage.',
      icon: 'HardDrive',
    },
    {
      id: 'extra-ipv4',
      name: 'Extra Dedicated IPv4 Address',
      priceINR: '₹100–₹200/mo',
      priceUSD: '$1.25–$2.50/mo',
      description: 'Additional clean static IPv4 addresses for SSL certificates and services.',
      icon: 'Network',
    },
    {
      id: 'backup-storage',
      name: 'Additional Backup Storage',
      priceINR: '₹49 / 50 GB',
      priceUSD: '$0.60 / 50 GB',
      description: 'Dedicated offsite object storage bucket for custom backups and dumps.',
      icon: 'Database',
    },
    {
      id: 'snapshot',
      name: 'On-Demand Instance Snapshot',
      priceINR: '₹29/mo',
      priceUSD: '$0.35/mo',
      description: 'Create instant point-in-time state snapshots prior to updates or migrations.',
      icon: 'Camera',
    },
    {
      id: 'extra-traffic',
      name: 'Extra Network Traffic',
      priceINR: '₹50–₹100/TB',
      priceUSD: '$0.65–$1.25/TB',
      description: 'High-bandwidth overage allocation for extreme traffic applications.',
      icon: 'Activity',
    },
    {
      id: 'managed-support',
      name: 'Managed VPS Support',
      priceINR: '₹199–₹499/mo',
      priceUSD: '$2.50–$6.00/mo',
      description: '24/7 priority hands-on support for server setup, tuning, and troubleshooting.',
      icon: 'Headphones',
    },
  ] as AddOnItem[],

  infrastructureSpecs: [
    {
      label: 'Processor (CPU)',
      key: 'cpu',
      value: '[FINAL CPU]',
      notes: 'High-frequency server CPU hardware details being finalized.',
      isFinalized: false,
    },
    {
      label: 'Memory (RAM)',
      key: 'memory',
      value: '[FINAL RAM]',
      notes: 'DDR4 / DDR5 ECC Registered server memory pool.',
      isFinalized: false,
    },
    {
      label: 'Storage',
      key: 'storage',
      value: '[FINAL NVMe CAPACITY]',
      notes: 'Enterprise-grade PCIe NVMe RAID array.',
      isFinalized: false,
    },
    {
      label: 'Uplink Network',
      key: 'network',
      value: '[FINAL UPLINK]',
      notes: 'High-speed redundant network interface.',
      isFinalized: false,
    },
    {
      label: 'Virtualization',
      key: 'virtualization',
      value: 'KVM',
      notes: 'Hardware-assisted kernel virtual machine isolation.',
      isFinalized: true,
    },
    {
      label: 'Datacenter Facility',
      key: 'datacenter',
      value: 'Mumbai Datacenter, India',
      notes: 'Tier IV compliant datacenter facility in Mumbai, India.',
      isFinalized: true,
    },
    {
      label: 'DDoS Mitigation',
      key: 'ddos',
      value: '[FINAL PROTECTION]',
      notes: 'Automated inline network filtering shield.',
      isFinalized: false,
    },
    {
      label: 'Deployment Status',
      key: 'status',
      value: 'Pre-Launch',
      notes: 'Pre-orders open. Physical server setup undergoing final validation.',
      isFinalized: true,
    },
  ] as TechnicalSpecification[],

  statusItems: [
    {
      name: 'Website & Pre-Orders',
      status: 'Operational',
      state: 'green',
      detail: 'Core web portal and pre-order registration online.',
    },
    {
      name: 'Pre-Orders',
      status: 'Open',
      state: 'green',
      detail: 'Founding allocation pre-orders actively accepted.',
    },
    {
      name: 'Infrastructure (Mumbai)',
      status: 'Preparing',
      state: 'yellow',
      detail: 'Physical hardware mounting, IP provisioning, and burn-in tests in Mumbai.',
    },
    {
      name: 'Customer Control Panel',
      status: 'Coming Soon',
      state: 'gray',
      detail: 'Control panel interface ready; backend integration pending infrastructure launch.',
    },
  ] as SystemStatusItem[],

  features: [
    {
      id: 'nvme',
      title: 'NVMe Storage',
      description: 'Fast storage designed for demanding workloads, ensuring high I/O speed and minimal latency for database operations.',
      icon: 'HardDrive',
    },
    {
      id: 'kvm',
      title: 'KVM Virtualization',
      description: 'Isolated virtual machines with predictable resource allocation, zero overcommit, and kernel control.',
      icon: 'Cpu',
    },
    {
      id: 'network',
      title: 'High-Speed Networking',
      description: 'Reliable connectivity for applications, websites, APIs, and production servers with low-latency routes.',
      icon: 'Globe',
    },
    {
      id: 'ddos',
      title: 'DDoS Protection',
      description: 'Protection designed to help keep your infrastructure online against automated traffic floods and network attacks.',
      icon: 'ShieldCheck',
    },
    {
      id: 'root',
      title: 'Full Root Access',
      description: 'Complete administrative control over your VPS environment, OS configuration, custom kernels, and software stacks.',
      icon: 'Terminal',
    },
    {
      id: 'scalable',
      title: 'Scalable Resources',
      description: 'Upgrade your infrastructure seamlessly as your application requirements and workload traffic grow.',
      icon: 'Zap',
    },
  ],

  customerCapabilities: [
    { title: 'VPS Management', desc: 'Power actions, rebooting, and node state management.' },
    { title: 'OS Reinstall', desc: 'Clean single-click image deployments for Ubuntu, Debian, AlmaLinux, and custom ISOs.' },
    { title: 'Serial Console', desc: 'Out-of-band VNC/TTY console access for direct emergency recovery.' },
    { title: 'Resource Monitoring', desc: 'Real-time telemetry for CPU usage, memory consumption, disk I/O, and network bandwidth.' },
    { title: 'Automated Backups', desc: 'Snapshot scheduling and instance state restores.' },
    { title: 'Advanced Networking', desc: 'PTR/Reverse DNS configuration, IPv4 management, and firewall rules.' },
    { title: 'Billing & Invoicing', desc: 'Transparent pre-order credits, monthly billing history, and itemized receipts.' },
    { title: 'Support Tickets', desc: 'Direct ticket communication channel with technical support staff.' },
    { title: 'Upgrade Options', desc: 'Seamless resource scaling as compute requirements increase.' },
  ],

  faqs: [
    {
      question: 'What is KryonHost?',
      answer: 'KryonHost provides high-performance VPS and cloud infrastructure built for developers, businesses, and online projects requiring fast NVMe storage, KVM isolation, and reliable network connectivity.',
    },
    {
      question: 'When will my VPS be provisioned?',
      answer: 'Datacenter live provisioning takes place between October 1 and October 10, 2026. You will receive an automated email notification on your registered email address when the pre-order period completes and your physical server node goes live.',
    },
    {
      question: 'What does the +4 GB RAM bonus mean?',
      answer: 'The first 20 qualifying founding customer pre-orders receive a permanent bonus allocation of +4 GB RAM added to their selected VPS plan (Performance, Pro, Enterprise) at launch at no extra cost.',
    },
    {
      question: 'Do I get root access?',
      answer: 'Yes, all KryonHost VPS instances provide full root access via SSH, giving you unrestricted control over OS configuration, firewall rules, and custom application installations.',
    },
    {
      question: 'Where are your servers located?',
      answer: 'Our launch infrastructure datacenter is located in Mumbai, India.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, pre-orders can be cancelled for a full 100% refund at any time prior to server provisioning. Standard post-launch refund terms apply per our Refund Policy.',
    },
  ],
};
