export type LoanStatus = 'NEW' | 'PENDING' | 'DOCUMENT_COLLECTION' | 'PRE_APPROVE' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'TRANSFERRED';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface CoBorrower {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  income: number;
  additionalIncome?: number;
  debtBurden?: number;
  creditScore: string;
  ncbCode?: string;
  relation: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  occupation: string;
  income: number;
  additionalIncome?: number;
  debtBurden?: number;
  creditScore: string;
  loanStatus: LoanStatus;
  ncbCode?: string;
  propertyIds?: string[];
  partnerId?: string;
  bankOfficerId?: string;
  lineId?: string;
  facebookUrl?: string;
  documentChecklist: DocumentChecklist;
  notes?: Note[];
  coBorrowers?: CoBorrower[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDetails {
  id: string;
  name: string;
  contactPhone: string;
  price: number;
  location: string;
  zone?: string;
  images?: string[];
  specifications: PropertySpecifications;
  ownerId?: string;
  showOwnerInfo?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  lineId?: string;
  facebookUrl?: string;
  ownerAddress?: string;
  mapUrl?: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lineId?: string;
  facebookUrl?: string;
  address?: string;
  ownerType: 'INDIVIDUAL' | 'COMPANY';
  bankAccount?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  notes?: string;
  createdAt: string;
}

export type PropertyType = 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'SEMI_DETACHED' | 'RENOVATED' | 'USED' | 'LAND';

export interface PropertySpecifications {
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floors: number;
}

export interface BankOfficer {
  id: string;
  name: string;
  bankName: string;
  phone: string;
  lineId?: string;
  facebookUrl?: string;
  notes?: string;
}

export interface PartnerDetails {
  id: string;
  name: string;
  phone: string;
  lineId?: string;
  facebookUrl?: string;
  bankName?: string;
  commissionRate: number;
  referralFee: number;
  notes?: string;
}

export interface DocumentChecklist {
  personal: {
    idCard: boolean;
    houseRegistration: boolean;
    nameChangeCertificate: boolean;
    marriageCertificate: boolean;
  };
  income: {
    salarySlip: boolean;
    bankStatement: boolean;
    employmentCertificate: boolean;
    taxReturn: boolean;
  };
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  customerId?: string;
  partnerId?: string;
  bankOfficerId?: string;
  location?: string;
  type: 'MEETING' | 'CALL' | 'SITE_VISIT' | 'DOCUMENT_SIGNING' | 'OTHER';
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}
