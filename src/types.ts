export interface BusinessConfig {
  businessId: string;
  businessName: string;
  tagline: string;
  description: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    cardBg: string;
  };
  logoText: string;
  services: {
    id: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    image: string;
    features: string[];
    priceRange: string;
  }[];
  serviceAreas: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  socialLinks: {
    instagram: string;
    houzz: string;
    yelp: string;
    facebook: string;
  };
  aiReceptionist: {
    name: string;
    title: string;
    avatar: string;
    welcomeMessage: string;
  };
  commissionPercentage: number;
  mode: 'demo' | 'production';
  domain: string;
}

export interface Lead {
  leadId: string;
  businessId: string;
  source: string;
  customerName: string;
  email: string;
  phone: string;
  projectType: string;
  projectDescription: string;
  projectCity: string;
  projectZip: string;
  budgetRange: string;
  desiredTimeline: string;
  qualificationStatus: 'Qualified' | 'Pending Review' | 'Unqualified' | 'QUALIFIED' | 'OUT_OF_SCOPE' | 'NEEDS_INFORMATION' | 'NEEDS_REVIEW';
  bookingStatus: 'Not Booked' | 'Slot Requested' | 'Confirmed' | 'Completed' | 'NOT_REQUESTED' | 'INVITED' | 'CONFIRMED' | 'PENDING_VERIFICATION';
  jobStatus: 'Estimate Sent' | 'In Design' | 'In Construction' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Deposit Paid' | 'Fully Paid';
  commissionStatus: 'Not Payable' | 'Eligible' | 'Invoiced' | 'Paid';
  createdAt: string;
  updatedAt: string;
  consentTimestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  extractedData?: Partial<Lead>;
}

export interface BookingSlot {
  slotId: string;
  date: string;
  time: string;
  available: boolean;
}

export type JobStatus = 
  | 'PROPOSED'
  | 'ESTIMATE_SCHEDULED'
  | 'ESTIMATE_COMPLETED'
  | 'QUOTE_SENT'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED'
  | 'Proposal'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Canceled'
  | 'Estimate Sent';

export type PaymentVerificationStatus = 
  | 'UNVERIFIED'
  | 'PARTIALLY_PAID'
  | 'VERIFIED_PAID'
  | 'REFUNDED'
  | 'DISPUTED';

export interface Job {
  jobId: string;
  businessId: string;
  leadId: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  jobDescription: string;
  jobStatus: JobStatus;
  quotedAmountCents: number;
  finalInvoiceAmountCents: number;
  verifiedPaidAmountCents: number;
  currency: string;
  completionDate?: string;
  paymentVerificationStatus: PaymentVerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  businessId: string;
  jobId: string;
  leadId: string;
  amountCents: number;
  paymentDate: string;
  paymentReference: string;
  verificationMethod: 'Manual Reconciliation' | 'Bank Wire' | 'Check' | 'Credit Card Verified';
  supportingEvidenceRef: string;
  reviewerIdentity: string;
  verificationTimestamp: string;
  status: 'UNVERIFIED' | 'VERIFIED' | 'REFUNDED';
}

export type LedgerEntryType = 
  | 'COMMISSION_EARNED'
  | 'COMMISSION_ADJUSTMENT'
  | 'COMMISSION_REVERSAL'
  | 'COMMISSION_SETTLED';

export interface LedgerEntry {
  ledgerEntryId: string;
  businessId: string;
  jobId: string;
  leadId: string;
  paymentReference: string;
  entryType: LedgerEntryType;
  amountCents: number;
  commissionRateBasisPoints: number; // 1000 = 10%
  commissionAmountCents: number;
  verificationSource: string;
  createdAt: string;
  createdBy: string;
  idempotencyKey: string;
}

export type UserRole = 'PLATFORM_ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_STAFF';

