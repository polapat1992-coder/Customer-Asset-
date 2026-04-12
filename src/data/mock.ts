import { Customer, PropertyDetails, PartnerDetails, Notification, BankOfficer, Appointment, Owner } from '../types';

export const mockOwners: Owner[] = [
  {
    id: 'o1',
    name: 'คุณสมชาย (เจ้าของ)',
    phone: '081-999-8888',
    email: 'somchai@email.com',
    lineId: 'somchai_owner',
    facebookUrl: 'https://facebook.com/somchai.owner',
    address: '123 พระราม 9, ห้วยขวาง, กรุงเทพฯ 10310',
    ownerType: 'INDIVIDUAL',
    bankAccount: {
      bankName: 'กสิกรไทย (KBank)',
      accountName: 'สมชาย รักทรัพย์',
      accountNumber: '123-4-56789-0'
    },
    notes: 'ตอบไวมาก สะดวกคุยทาง Line',
    createdAt: new Date().toISOString(),
  }
];

export const mockProperties: PropertyDetails[] = [
  {
    id: 'p1',
    name: 'ศุภาลัย เวอเรนด้า พระราม 9',
    contactPhone: '081-234-5678',
    price: 3500000,
    location: 'พระราม 9, กรุงเทพฯ',
    zone: 'พระราม 9',
    specifications: {
      type: 'CONDO',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      floors: 1,
    },
    ownerId: 'o1',
    showOwnerInfo: true,
    ownerName: 'คุณสมชาย (เจ้าของ)',
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
    notes: 'ดูแลเคสพนักงานบริษัทได้ดีมาก'
  },
  {
    id: 'bo2',
    name: 'คุณนพดล ม่วงธนาคาร',
    bankName: 'KBank',
    phone: '082-222-3333',
    lineId: 'nop_kbank',
    notes: 'ปรึกษาเคสธุรกิจส่วนตัวได้'
  },
  {
    id: 'bo3',
    name: 'คุณประเสริฐ มีทรัพย์',
    bankName: 'ธนาคารกรุงเทพ (BBL)',
    phone: '083-456-7890',
    notes: 'ดูแลเขตกรุงเทพและปริมณฑล',
  },
  {
    id: 'bo4',
    name: 'คุณนารี รุ่งเรือง',
    bankName: 'กรุงศรี (BAY)',
    phone: '084-567-8901',
    lineId: 'naree_bay',
  },
  {
    id: 'bo5',
    name: 'คุณมานะ อดทน',
    bankName: 'กรุงไทย (KTB)',
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
    name: 'สมศรี รักดี',
    phone: '089-876-5432',
    occupation: 'วิศวกรซอฟต์แวร์',
    income: 65000,
    additionalIncome: 15000,
    debtBurden: 12000,
    creditScore: 'ดี',
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
        creditScore: 'ดี',
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
        content: 'ลูกค้าสนใจศุภาลัย เวอเรนด้า กำลังเตรียมเอกสารสลิปเงินเดือน',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'n2',
        content: 'เช็คเครดิตเบื้องต้นผ่านแล้ว รอส่งยื่นจริง',
        createdAt: new Date().toISOString(),
      }
    ],
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    message: 'คุณสมศรี รักดี ได้รับการอนุมัติเบื้องต้น (Pre-approve) จาก SCB แล้ว',
    read: false,
    createdAt: new Date().toISOString(),
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    title: 'พาชมทรัพย์: ศุภาลัย เวอเรนด้า',
    description: 'พาลูกค้าสมศรีไปดูบ้านตัวอย่าง',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '11:30',
    customerId: 'c1',
    location: 'ศุภาลัย เวอเรนด้า พระราม 9',
    type: 'SITE_VISIT'
  },
  {
    id: 'a2',
    title: 'โทรปรึกษาสินเชื่อ',
    description: 'คุยเคสคุณสมศรีกับคุณกิตติศักดิ์',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '14:00',
    endTime: '14:30',
    bankOfficerId: 'bo1',
    type: 'CALL'
  }
];
