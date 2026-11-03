import { CampaignData } from '../types/campaign';

export const DEFAULT_HERO_IMAGE = '/src/assets/images/newaro_brand_hero_1793721383262.jpg';
export const DEFAULT_LOGO_IMAGE = '/src/assets/images/newaro_brand_logo_1793721382095.jpg';

export const INITIAL_OFFICE_DETAILS = {
  bossName: 'Executive Director (Boss)',
  bossTitle: 'Managing Director & Head of Office',
  department: 'Operations & Technical Division',
  memoId: 'MEMO-BOSS-2026-08',
  priority: 'urgent' as const,
  deadline: 'Today by 5:00 PM',
  requireAck: true,
  ackButtonText: 'Acknowledge Boss Directive & Confirm Read',
  ackLink: 'https://newaro.com/office-confirm',
};

export const INITIAL_CAMPAIGN: CampaignData = {
  dispatchMode: 'office', // Default to office package as user emphasized
  officeDetails: INITIAL_OFFICE_DETAILS,
  senderName: 'Executive Director Desk | NEWARO Office',
  brandName: 'NEWARO Operations & Executive Command',
  brandLogoUrl: DEFAULT_LOGO_IMAGE,
  subject: 'Executive Notice: Priority Project Tasks and Schedule for {{name}}',
  title: 'Executive Task Directive: Priority Execution Plan for Staff',
  description: `To all staff members and team workers:

This is an official directive issued directly by executive management. Please review the operational directives below and execute your assigned responsibilities without delay.

Key Action Requirements:
1. Complete all assigned project deliverables before the specified deadline.
2. Confirm receipt of this memo by clicking the acknowledgment button below.
3. Reach out via the direct executive line if you encounter any operational bottlenecks.

Timely execution is mandatory for this reporting cycle.`,
  heroImageUrl: DEFAULT_HERO_IMAGE,
  buttonText: 'Confirm Received & Acknowledge Boss Order',
  buttonLink: 'https://newaro.com/office-confirm',
  buttonColor: '#dc2626',
  buttonTextColor: '#ffffff',
  blockOrder: ['header', 'title', 'hero_image', 'description', 'primary_button', 'advance_features'],
  features: {
    phoneNumber: '+1 (415) 890-3291',
    phoneLabel: 'Boss Direct Hotline / Office Ext #402',
    replyEmail: 'newaronp@gmail.com',
    replyLabel: 'Direct Reply to Executive Desk',
    mapLocation: 'HQ 4th Floor Conference Center & Main Office',
    mapUrl: 'https://maps.google.com/?q=Market+Street+San+Francisco+CA',
    pitchDeckUrl: 'https://newaro.com/assets/office_directive_q4.pdf',
    pitchDeckLabel: 'Download Official Task Directive (PDF)',
    invoiceAmount: '3,850',
    invoiceCurrency: '$',
    paymentUrl: 'https://newaro.com/payroll-portal',
    paymentLabel: 'View Monthly Staff Payroll & Bonus Summary',
    socialProofScore: 'Office Operational Standard 100%',
    socialProofReview: 'All departments achieved flawless resolution metrics under current executive direction.',
    urgencyText: 'Mandatory acknowledgment deadline: Today before 5:00 PM sharp.',
    urgencyDaysLeft: 'Immediate Action Required',
    bookingUrl: 'https://calendly.com/newaro-director/strategic-brief',
    bookingLabel: 'Join Office Video Sync',
    sponsorDisclaimer: 'Confidential Internal Office Communication from Executive Management. Authorized Staff Only.',
    unsubscribeUrl: 'https://newaro.com/office-preferences',
  },
  enabledFeatures: {
    phone: true,
    reply: true,
    map: true,
    pitchDeck: true,
    payment: true,
    socialProof: true,
    urgency: true,
    booking: true,
    disclaimer: true,
    unsubscribe: true,
  },
};

export const OFFICE_TEMPLATES: Record<string, { label: string; description: string; data: Partial<CampaignData> }> = {
  urgentDirective: {
    label: 'Executive Task Directive',
    description: 'Direct instructions sent by boss to staff with immediate acknowledgment requirement.',
    data: {
      subject: 'Executive Notice: Priority Action Tasks for {{name}}',
      title: 'Mandatory Executive Action Directive',
      buttonText: 'Acknowledge Boss Directive & Log Completion',
      buttonColor: '#0f172a',
      buttonTextColor: '#ffffff',
      description: `Attention {{name}},

This is an official directive from the Executive Director. All scheduled deliverables for your unit must be prioritized and completed by {{boss}}'s deadline.

Immediate Steps:
- Review required task checklist in attached documents.
- Click below to acknowledge receipt of this directive.
- Report all completion timestamps to the department supervisor.`,
      officeDetails: {
        ...INITIAL_OFFICE_DETAILS,
        priority: 'urgent',
        deadline: 'Today by 5:00 PM',
        memoId: 'MEMO-BOSS-01',
      },
    },
  },
  payrollBonus: {
    label: 'Monthly Payroll & Performance Bonus',
    description: 'Official boss memo covering salary, overtime allowances, and bonus distribution.',
    data: {
      subject: 'Official Memo: Monthly Staff Payroll & Performance Bonus Distribution',
      title: 'Executive Notice: Monthly Compensation & Bonus Schedule',
      buttonText: 'Access Secure Payroll Portal',
      buttonColor: '#059669',
      buttonTextColor: '#ffffff',
      description: `Dear {{name}},

Executive management has approved this month's payroll disbursement and quarterly performance bonuses.

Details:
- Base compensation and approved overtime are scheduled for release this Friday.
- Departmental performance bonuses have been finalized.
- Review your individualized payroll statement via the secure link below.`,
      officeDetails: {
        ...INITIAL_OFFICE_DETAILS,
        priority: 'high',
        deadline: 'Review by Thursday 6:00 PM',
        memoId: 'PAYROLL-DISBURSE-2026',
      },
    },
  },
  allHandsMeeting: {
    label: 'All-Hands Office Assembly & Sync',
    description: 'Mandatory company-wide assembly notice sent by boss to all 30 office workers.',
    data: {
      subject: 'Mandatory Notice: Executive All-Hands Office Assembly at 10:00 AM',
      title: 'Company-Wide Staff Assembly & Operational Briefing',
      buttonText: 'Confirm Attendance & Access Conference Link',
      buttonColor: '#2563eb',
      buttonTextColor: '#ffffff',
      description: `Staff Notice for {{name}},

Managing Director {{boss}} has called an All-Hands meeting for all 30 office staff members in the Main Conference Room and via secure internal video bridge.

Agenda:
1. Operational progress report and target milestones.
2. Departmental problem-solving updates.
3. Q&A directly with the Executive Boss.

Attendance is mandatory for all active team personnel.`,
      officeDetails: {
        ...INITIAL_OFFICE_DETAILS,
        priority: 'high',
        deadline: 'Tomorrow at 10:00 AM',
        memoId: 'ALL-HANDS-SYNC-44',
      },
    },
  },
  projectMilestones: {
    label: 'Project Sprint & Shift Assignments',
    description: 'Staff shift assignments, work duty rotations, and critical deadlines.',
    data: {
      subject: 'Duty Roster & Project Milestone Assignments: Action for {{name}}',
      title: 'Office Project Sprint: Shift Assignments & Deadlines',
      buttonText: 'Confirm Assigned Shift & Responsibilities',
      buttonColor: '#0f172a',
      buttonTextColor: '#ffffff',
      description: `Hello {{name}},

Below are the approved shift assignments and milestone deliverables for the upcoming operational cycle.

Please check your assigned roles, prepare necessary handovers, and ensure uninterrupted coverage for all client-facing desks.`,
      officeDetails: {
        ...INITIAL_OFFICE_DETAILS,
        priority: 'routine',
        deadline: 'End of Shift',
        memoId: 'SHIFT-ROSTER-Q4',
      },
    },
  },
};

export const MARKETING_TEMPLATES: Record<string, { label: string; description: string; data: Partial<CampaignData> }> = {
  problemSolver: {
    label: 'Brand Problem Solver Pitch',
    description: 'Executive strategy proposal focused on identifying brand friction and closing retainers.',
    data: {
      subject: 'Executive Brand Resolution & Market Acceleration for {{brand}}',
      title: 'Solving Fundamental Brand Obstacles With Precision Marketing',
      buttonText: 'Authorize Strategy Sprint & Review Brief',
      buttonColor: '#d97706',
      buttonTextColor: '#ffffff',
      blockOrder: ['header', 'title', 'hero_image', 'description', 'primary_button', 'advance_features'],
    },
  },
  getPaidByBrand: {
    label: 'Get Paid by Brand: Sponsorship & Retainer',
    description: 'High-converting rate card and sponsorship retainer notice to get funded directly by partner brands.',
    data: {
      subject: 'Commercial Brand Sponsorship & Editorial Partnership Opportunity',
      title: 'Exclusive High-Impact Brand Sponsorship & Co-Marketing Placement',
      description: `Dear {{name}},

We are opening 2 exclusive marketing sponsorship placements for {{brand}} to reach an elite audience of decision makers and high-intent consumers.

Our partner brands average over 4.2x ROI through verified campaign placement, dedicated email broadcast to 40,000+ verified buyers, and direct endorsement.

Review the sponsorship package fee below and claim your brand placement before allocation closes.`,
      buttonText: 'Claim Brand Sponsorship Slot',
      buttonColor: '#059669',
      buttonTextColor: '#ffffff',
      blockOrder: ['header', 'primary_button', 'title', 'hero_image', 'description', 'advance_features'],
    },
  },
};

export const SAMPLE_30_WORKERS = [
  'bishal@gmail.com',
  'nepalo@gmail.com',
  'worker1.ops@office.internal',
  'worker2.dev@office.internal',
  'worker3.support@office.internal',
  'worker4.qa@office.internal',
  'worker5.marketing@office.internal',
  'worker6.finance@office.internal',
  'worker7.hr@office.internal',
  'worker8.design@office.internal',
  'worker9.sales@office.internal',
  'worker10.logistics@office.internal',
  'worker11.security@office.internal',
  'worker12.lead@office.internal',
  'worker13.analyst@office.internal',
  'worker14.legal@office.internal',
  'worker15.admin@office.internal',
  'worker16.ops@office.internal',
  'worker17.content@office.internal',
  'worker18.tech@office.internal',
  'worker19.field@office.internal',
  'worker20.manager@office.internal',
  'worker21.assistant@office.internal',
  'worker22.specialist@office.internal',
  'worker23.clientdesk@office.internal',
  'worker24.dispatch@office.internal',
  'worker25.coordinator@office.internal',
  'worker26.billing@office.internal',
  'worker27.auditor@office.internal',
  'worker28.associate@office.internal',
];

export const SAMPLE_MARKETING_CUSTOMERS = [
  'bishal@gmail.com',
  'nepalo@gmail.com',
  'director@brandpulse.co',
  'marketing@apexstrategy.io',
  'partners@venturecorp.org',
  'ceo@hypergrowth.ai',
  'sponsor@fintechweekly.net',
  'vp@globalcommerce.io',
  'founder@growthstack.com',
  'head@brandstudio.org',
];
