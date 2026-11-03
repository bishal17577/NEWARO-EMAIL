export interface CampaignFeatures {
  phoneNumber: string;
  phoneLabel: string;
  replyEmail: string;
  replyLabel: string;
  mapLocation: string;
  mapUrl: string;
  pitchDeckUrl: string;
  pitchDeckLabel: string;
  invoiceAmount: string;
  invoiceCurrency: string;
  paymentUrl: string;
  paymentLabel: string;
  socialProofScore: string;
  socialProofReview: string;
  urgencyText: string;
  urgencyDaysLeft: string;
  bookingUrl: string;
  bookingLabel: string;
  sponsorDisclaimer: string;
  unsubscribeUrl: string;
}

export type BlockId = 'header' | 'title' | 'hero_image' | 'description' | 'primary_button' | 'advance_features';

export type DispatchMode = 'marketing' | 'office';

export interface OfficeDetails {
  bossName: string;
  bossTitle: string;
  department: string;
  memoId: string;
  priority: 'routine' | 'high' | 'urgent';
  deadline: string;
  requireAck: boolean;
  ackButtonText: string;
  ackLink: string;
}

export interface CampaignData {
  dispatchMode: DispatchMode;
  officeDetails: OfficeDetails;
  senderName: string;
  brandName: string;
  brandLogoUrl: string;
  subject: string;
  title: string;
  description: string;
  heroImageUrl: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string;
  buttonTextColor: string;
  blockOrder: BlockId[];
  features: CampaignFeatures;
  enabledFeatures: Record<string, boolean>;
}

export interface RecipientItem {
  id: string;
  email: string;
  role?: string;
  status: 'idle' | 'sending' | 'sent' | 'failed';
  error?: string;
  messageId?: string;
}

export interface SmtpConfig {
  user: string;
  pass: string;
}
