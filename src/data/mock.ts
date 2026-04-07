import { Customer, PropertyDetails, PartnerDetails, Notification, BankOfficer, Appointment, Owner } from '../types';

export const mockOwners: Owner[] = [
  {
    id: 'o1',
    name: 'Mr. Somchai (Owner)',
    phone: '081-999-8888',
    email: 'somchai@email.com',
    lineId: 'somchai_owner',
    facebookUrl: 'https://facebook.com/somchai.owner',
    address: '123 Rama 9, Huai Khwang, Bangkok 10310',
    ownerType: 'INDIVIDUAL',
    bankAccount: {
      bankName: 'กสิกรไทย (KBank)',
      accountName: 'สมชาย รักทรัพย์',
      accountNumber: '123-4-56789-0'
    },
    notes: 'Very responsive, prefers Line',
    createdAt: new Date().toISOString(),
  }
];

export const mockProperties: PropertyDetails[] = [
  {
    id: 'p1',
    name: 'Supalai Veranda Rama 9',
    contactPhone: '081-234-5678',
    price: 3500000,
    location: 'Rama 9, Bangkok',
    zone: 'Rama 9',
    specifications: {
      type: 'CONDO',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      floors: 1,
    },
    ownerId: 'o1',
    showOwnerInfo: true,
    ownerName: 'Mr. Somchai (Owner)',
    ownerPhone: '081-999-8888',
    lineId: 'somchai_owner',
    facebookUrl: 'https://facebook.com/somchai.owner',
    mapUrl: 'https://goo.gl/maps/example'
  }
];

export const mockBankOfficers: BankOfficer[] = [
  {
    id: 'bo1',
    name: 'Mr. Kittisak Loan',
    bankName: 'SCB',
    phone: '081-111-2222',
    lineId: 'kitti_scb',
    notes: 'Handles corporate employees very well'
  },
  {
    id: 'bo2',
    name: 'Mr. Noppadol PurpleBank',
    bankName: 'KBank',
    phone: '082-222-3333',
    lineId: 'nop_kbank',
    notes: 'Consult for private business cases'
  },
  {
    id: 'bo3',
    name: 'Mr. Prasert Meesap',
    bankName: 'Bangkok Bank (BBL)',
    phone: '083-456-7890',
    notes: 'Covers Bangkok and metropolitan areas',
  },
  {
    id: 'bo4',
    name: 'Ms. Naree Rungrueang',
    bankName: 'Krungsri (BAY)',
    phone: '084-567-8901',
    lineId: 'naree_bay',
  },
  {
    id: 'bo5',
    name: 'Mr. Mana Odtol',
    bankName: 'Krungthai (KTB)',
    phone: '085-678-9012',
  },
];

export const mockPartners: PartnerDetails[] = [
  {
    id: 'pt1',
    name: 'Mr. Somchai Independent Agent',
    phone: '085-555-6666',
    lineId: 'somchai_agent',
    bankName: 'SCB',
    commissionRate: 1.5,
    referralFee: 10000,
    notes: 'Mainly sends condo cases'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Somsri Rakdee',
    phone: '089-876-5432',
    occupation: 'Software Engineer',
    income: 65000,
    additionalIncome: 15000,
    debtBurden: 12000,
    creditScore: 'Good',
    ncbCode: '010',
    loanStatus: 'PRE_APPROVE',
    propertyIds: ['p1'],
    partnerId: 'pt1',
    bankOfficerId: 'bo1',
    lineId: 'somsri_line',
    facebookUrl: 'https://facebook.com/somsri.rakdee',
    coBorrowers: [
      {
        id: 'cb1',
        name: 'Somchai Rakdee',
        phone: '082-345-6789',
        occupation: 'Employee',
        income: 25000,
        creditScore: 'Good',
        relation: 'Spouse'
      }
    ],
    documentChecklist: {
      personal: {
        idCard: true,
        houseRegistration: true,
        nameChangeCertificate: false,
        marriageCertificate: false,
      },
      income: {
        salarySlip: true,
        bankStatement: true,
        employmentCertificate: false,
        taxReturn: false,
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [
      {
        id: 'n1',
        content: 'Customer interested in Supalai Veranda. Preparing salary slip documents.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'n2',
        content: 'Preliminary credit check passed. Waiting for actual submission.',
        createdAt: new Date().toISOString(),
      }
    ],
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    message: 'Somsri Rakdee has been pre-approved by SCB.',
    read: false,
    createdAt: new Date().toISOString(),
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    title: 'Site Visit: Supalai Veranda',
    description: 'Take customer Somsri to see the sample house',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '11:30',
    customerId: 'c1',
    location: 'Supalai Veranda Rama 9',
    type: 'SITE_VISIT'
  },
  {
    id: 'a2',
    title: 'Loan Consultation Call',
    description: 'Discuss Somsri case with Mr. Kittisak',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '14:00',
    endTime: '14:30',
    bankOfficerId: 'bo1',
    type: 'CALL'
  }
];
