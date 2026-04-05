import { Customer, PropertyDetails, PartnerDetails, Notification, BankOfficer, Appointment } from '../types';

export const mockProperties: PropertyDetails[] = [
  {
    id: 'p1',
    name: 'Supalai Veranda Rama 9',
    contactPhone: '081-234-5678',
    price: 3500000,
    location: 'Rama 9, Bangkok',
    zone: 'พระราม 9',
    specifications: {
      type: 'CONDO',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      floors: 1,
    },
    ownerName: 'คุณสมชาย เจ้าของทรัพย์',
    ownerPhone: '081-999-8888',
    lineId: 'somchai_owner',
    facebookUrl: 'https://facebook.com/somchai.owner',
    mapUrl: 'https://goo.gl/maps/example'
  }
];

export const mockBankOfficers: BankOfficer[] = [
  {
    id: 'bo1',
    name: 'คุณกิตติศักดิ์ สินเชื่อ',
    bankName: 'SCB',
    phone: '081-111-2222',
    lineId: 'kitti_scb',
    notes: 'ดูแลเคสพนักงานประจำได้ดีมาก'
  },
  {
    id: 'bo2',
    name: 'คุณนพดล แบงก์ม่วง',
    bankName: 'KBank',
    phone: '082-222-3333',
    lineId: 'nop_kbank',
    notes: 'เคสธุรกิจส่วนตัวปรึกษาคนนี้'
  },
  {
    id: 'bo3',
    name: 'คุณประเสริฐ มีทรัพย์',
    bankName: 'Bangkok Bank (BBL)',
    phone: '083-456-7890',
    notes: 'ดูแลเขตกรุงเทพและปริมณฑล',
  },
  {
    id: 'bo4',
    name: 'คุณนารี รุ่งเรือง',
    bankName: 'Krungsri (BAY)',
    phone: '084-567-8901',
    lineId: 'naree_bay',
  },
  {
    id: 'bo5',
    name: 'คุณมานะ อดทน',
    bankName: 'Krungthai (KTB)',
    phone: '085-678-9012',
  },
];

export const mockPartners: PartnerDetails[] = [
  {
    id: 'pt1',
    name: 'คุณสมชาย นายหน้าอิสระ',
    phone: '085-555-6666',
    lineId: 'somchai_agent',
    bankName: 'SCB',
    commissionRate: 1.5,
    referralFee: 10000,
    notes: 'ส่งเคสคอนโดเป็นหลัก'
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
        name: 'สมชาย รักดี',
        phone: '082-345-6789',
        occupation: 'พนักงานบริษัท',
        income: 25000,
        creditScore: 'Good',
        relation: 'คู่สมรส'
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
        content: 'ลูกค้าสนใจ Supalai Veranda กำลังเตรียมเอกสารสลิปเงินเดือน',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'n2',
        content: 'เช็คบูโรเบื้องต้นผ่าน รอยื่นกู้จริง',
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
    title: 'นัดดูบ้าน Supalai Veranda',
    description: 'พาลูกค้า Somsri ไปดูบ้านตัวอย่าง',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '11:30',
    customerId: 'c1',
    location: 'Supalai Veranda Rama 9',
    type: 'SITE_VISIT'
  },
  {
    id: 'a2',
    title: 'โทรปรึกษาเรื่องสินเชื่อ',
    description: 'คุยกับคุณกิตติศักดิ์ เรื่องเคส Somsri',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '14:00',
    endTime: '14:30',
    bankOfficerId: 'bo1',
    type: 'CALL'
  }
];
