import { RoleCapability, UserRoleId, CeoDirective } from '../types';

export const ROLE_CAPABILITIES: Record<UserRoleId, RoleCapability> = {
  ceo: {
    canViewAllReports: true,
    canImportExpressCsv: true,
    canClearSystemData: true,
    canResetSampleData: true,
    canCreateDirectives: true,
    canReplyToDirectives: true,
    canCreateQuotes: true,
    canOverrideMarginGuardrails: true,
    canUpdateDeliveryStatus: true,
    canManageReceivablesAr: true,
    canManageDeposits: true,
    canExportFinancialLedgers: true,
  },
  admin: {
    canViewAllReports: true,
    canImportExpressCsv: true,
    canClearSystemData: true,
    canResetSampleData: true,
    canCreateDirectives: false,
    canReplyToDirectives: true,
    canCreateQuotes: true,
    canOverrideMarginGuardrails: false,
    canUpdateDeliveryStatus: true,
    canManageReceivablesAr: true,
    canManageDeposits: true,
    canExportFinancialLedgers: true,
  },
  sales: {
    canViewAllReports: false,
    canImportExpressCsv: false,
    canClearSystemData: false,
    canResetSampleData: false,
    canCreateDirectives: false,
    canReplyToDirectives: true,
    canCreateQuotes: true,
    canOverrideMarginGuardrails: false,
    canUpdateDeliveryStatus: false,
    canManageReceivablesAr: false,
    canManageDeposits: false,
    canExportFinancialLedgers: false,
  },
  warehouse: {
    canViewAllReports: false,
    canImportExpressCsv: false,
    canClearSystemData: false,
    canResetSampleData: false,
    canCreateDirectives: false,
    canReplyToDirectives: true,
    canCreateQuotes: false,
    canOverrideMarginGuardrails: false,
    canUpdateDeliveryStatus: true,
    canManageReceivablesAr: false,
    canManageDeposits: false,
    canExportFinancialLedgers: false,
  },
  accounting: {
    canViewAllReports: false,
    canImportExpressCsv: true,
    canClearSystemData: false,
    canResetSampleData: false,
    canCreateDirectives: false,
    canReplyToDirectives: true,
    canCreateQuotes: false,
    canOverrideMarginGuardrails: false,
    canUpdateDeliveryStatus: false,
    canManageReceivablesAr: true,
    canManageDeposits: true,
    canExportFinancialLedgers: true,
  },
};

export interface RoleDetail {
  id: UserRoleId;
  nameTh: string;
  nameEn: string;
  badgeTh: string;
  badgeEn: string;
  requiresPassword?: boolean;
  canDoTh: string[];
  canDoEn: string[];
  cannotDoTh: string[];
  cannotDoEn: string[];
  descriptionTh: string;
  descriptionEn: string;
}

export const ROLE_DETAILS: Record<UserRoleId, RoleDetail> = {
  ceo: {
    id: 'ceo',
    nameTh: 'ผู้บริหารสูงสุด (CEO)',
    nameEn: 'Chief Executive Officer (CEO)',
    badgeTh: 'สิทธิ์สูงสุด (Master)',
    badgeEn: 'Unrestricted Master',
    requiresPassword: true,
    canDoTh: [
      'เข้าถึงข้อมูลทุกเมนู ทุกฟังก์ชัน 100% โดยไม่มีข้อจำกัด',
      'เขียนข้อสั่งการและโน้ต/คอมเมนต์กำชับการทำงานถึงแอดมิน (Admin) และทุกฝ่าย',
      'อนุมัติข้อยกเว้นราคาขายต่ำกว่าเกณฑ์กำไรขั้นต่ำ (Override Gross Margin Floor 18%)',
      'ล้างฐานข้อมูลระบบทั้งหมด และรีเซ็ตข้อมูลตัวอย่าง',
      'ดูรายงานวิเคราะห์ผลกำไร คาดการณ์ยอดขาย Track A และข้อมูลความเสี่ยงลูกหนี้',
      'อัปเดตสถานะคิวผลิตและงานจัดส่งสินค้าได้โดยตรง',
    ],
    canDoEn: [
      '100% full unrestricted access across all views, tools, and actions',
      'Write direct executive directives, notes, and comments to Admin and all departments',
      'Override and approve below-floor quote margins (Margin Floor < 18%)',
      'Wipe entire database or restore default sample data sets',
      'View confidential P&L forecasts, Track A seasonal projections, and high-risk AR debtors',
      'Directly update manufacturing & delivery queue statuses',
    ],
    cannotDoTh: [
      'ไม่มีข้อจำกัดใดๆ (Unrestricted Privileges)',
    ],
    cannotDoEn: [
      'None (Full unrestricted super-user privileges)',
    ],
    descriptionTh: 'เจ้าของกิจการและผู้บริหารสูงสุด มีรหัสผ่านเฉพาะ (1234) ในการปลดล็อกสิทธิ์ สามารถออกคำสั่ง กำชับงาน และติดตามงานทุกฝ่ายได้ทันที',
    descriptionEn: 'Company owner & executive. Protected by Master PIN (1234). Controls strategic decisions and issues operational directives to Admin.',
  },
  admin: {
    id: 'admin',
    nameTh: 'ผู้ดูแลระบบ (System Admin)',
    nameEn: 'System Administrator (Admin)',
    badgeTh: 'จัดการข้อมูล & ประสานงาน',
    badgeEn: 'Data Ops & Coordination',
    canDoTh: [
      'นำเข้า ตรวจสอบ และเชื่อมโยง 3 ไฟล์ CSV จาก Express Accounting',
      'รับข้อสั่งการจาก CEO และตอบกลับคอมเมนต์รายงานความคืบหน้า',
      'ตรวจสอบความถูกต้องของฐานข้อมูลและสลับชุดข้อมูลตัวอย่าง',
      'เข้าถึงหน้าตารางข้อมูลและตรวจสอบประวัติงานทั้งหมด',
      'ช่วยเหลือผู้ใช้งานทุกฝ่ายในการแก้ปัญหาข้อมูล',
    ],
    canDoEn: [
      'Ingest, reconcile, and validate Express 3-CSV data files',
      'Receive directives from CEO and post progress comments/replies',
      'Inspect system database tables and restore seed templates',
      'Access all data tables and audit historical records',
      'Provide operational data support to sales, warehouse, and accounting',
    ],
    cannotDoTh: [
      'ไม่สามารถออกข้อสั่งการในนาม CEO ได้ (ทำได้เฉพาะรับคำสั่งและตอบกลับ)',
      'ไม่สามารถอนุมัติใบเสนอราคาที่กำไรต่ำกว่าเกณฑ์ Floor ได้โดยพลการ (ต้องให้ CEO อนุมัติ)',
    ],
    cannotDoEn: [
      'Cannot originate CEO Executive Directives (can only reply and update status)',
      'Cannot unilaterally approve quotes below the 18% profit margin floor',
    ],
    descriptionTh: 'ฝ่ายไอทีและผู้ดูแลระบบ ทำหน้าที่เชื่อมต่อข้อมูล Express ตอบรับคำสั่งจาก CEO และคอยดูแลความเรียบร้อยของข้อมูลทั้งระบบ',
    descriptionEn: 'IT & System Administrator. Handles 3-CSV imports, responds to CEO directives, and maintains company data pipelines.',
  },
  sales: {
    id: 'sales',
    nameTh: 'ผู้จัดการฝ่ายขาย (Sales Manager)',
    nameEn: 'Sales Manager',
    badgeTh: 'งานขาย & ใบเสนอราคา',
    badgeEn: 'Sales & Quoting',
    canDoTh: [
      'สร้างใบเสนอราคาด้วย Track B Quote Assistant พร้อมตรวจสอบอัตรากำไร',
      'ดูประวัติการขายเงินสด (Cash Sales) รายละเอียดสินค้า และราคาต่อหน่วย',
      'ดูฐานข้อมูลลูกค้า ช่างติดตั้ง และโครงการก่อสร้าง',
      'ตรวจสอบระดับสต็อกสินค้าเพื่อแจ้งกำหนดส่งมอบแก่ลูกค้า',
      'ดูข้อเสนอแนะด้านการขายและสินค้าขายดี',
      'ตอบกลับข้อสั่งการของ CEO ที่มอบหมายให้ฝ่ายขาย',
    ],
    canDoEn: [
      'Generate professional quotes with Track B margin guardrail calculations',
      'Review daily Cash Sales ledger, line items, and product pricing',
      'Browse contractor, builder, and customer account directory',
      'Check inventory availability to quote reliable delivery lead times',
      'View sales recommendations and top-selling product metrics',
      'Reply to CEO directives assigned to the Sales Department',
    ],
    cannotDoTh: [
      'ไม่สามารถล้างฐานข้อมูลระบบ หรือแก้ไขโครงสร้างไฟล์ CSV ได้',
      'ไม่สามารถอนุมัติใบเสนอราคาที่กำไรต่ำกว่าเกณฑ์ (ต่ำกว่า 18%) ได้เอง (ต้องให้ CEO อนุมัติ)',
      'ไม่สามารถเปลี่ยนสถานะการผลิตในโรงงาน (เป็นหน้าที่ของฝ่ายคลัง/ผลิต)',
      'ไม่สามารถตัดยอดเงินมัดจำหรือปรับปรุงหนี้สูญทางบัญชีได้',
    ],
    cannotDoEn: [
      'Cannot clear database or modify core Express CSV sync data',
      'Cannot self-approve quotes with margins below the 18% floor (requires CEO override)',
      'Cannot change manufacturing queue stages (restricted to Warehouse/Factory)',
      'Cannot reconcile deposit receipts or write off bad debts (restricted to Accounting)',
    ],
    descriptionTh: 'รับผิดชอบงานขาย ทำราคาเสนอช่างผู้รับเหมา ดูแลยอดขายรายวัน ทำงานภายในขอบเขตงานขายเท่านั้น',
    descriptionEn: 'Focuses on customer relationships, sales quotes with margin guardrails, and daily cash sales verification.',
  },
  warehouse: {
    id: 'warehouse',
    nameTh: 'เจ้าหน้าที่คลังสินค้าและผลิต (Warehouse)',
    nameEn: 'Warehouse & Production Supervisor',
    badgeTh: 'คลัง & สายการผลิต',
    badgeEn: 'Inventory & Factory',
    canDoTh: [
      'ตรวจสอบสุขภาพสต็อกสินค้า วันครอบคลุมสต็อก (Days of Cover) และจุดสั่งซื้อซ้ำ (ROP)',
      'ตรวจสอบรายการสินค้าค้างสต็อกเกิน 90 วัน (Push List) เพื่อประสานฝ่ายขายระบายสินค้า',
      'อัปเดตสถานะคิวงานสั่งผลิต: รอรีดลอน -> กำลังติด PU -> พร้อมจัดส่ง -> จัดส่งเรียบร้อย',
      'ตรวจสอบเบอร์ติดต่อช่างติดตั้งและสถานที่จัดส่งหน้างาน',
      'ตอบกลับข้อสั่งการของ CEO ที่มอบหมายให้ฝ่ายคลังสินค้า',
    ],
    canDoEn: [
      'Monitor Stock Health, Days of Cover (DoC), and Reorder Points (ROP)',
      'Track slow-moving stock (>90 days push list) to coordinate promotional clearance',
      'Update manufacturing stages: Queued -> PU Bonding -> Ready -> Delivered',
      'Access installer contact details and site delivery logistics',
      'Reply to CEO directives assigned to Warehouse/Factory operations',
    ],
    cannotDoTh: [
      'ไม่สามารถดูรายงานวิเคราะห์ผลกำไรสุทธิ และการคาดการณ์ยอดขายระดับบริหารได้',
      'ไม่สามารถเข้าถึงข้อมูลวงเงินเครดิตและหนี้ค้างชำระของลูกค้า (ข้อมูลฝ่ายบัญชี)',
      'ไม่สามารถออกใบเสนอราคาหรือแก้ไขราคาขายสินค้าได้',
      'ไม่สามารถล้างข้อมูลระบบหรือนำเข้าไฟล์บัญชี Express ได้',
    ],
    cannotDoEn: [
      'Cannot view confidential executive profit margins or financial run rate projections',
      'Cannot access customer credit limits or AR debt ledgers (Accounting domain)',
      'Cannot issue sales quotes or alter selling prices',
      'Cannot clear system data or import Express accounting CSVs',
    ],
    descriptionTh: 'ดูแลสต็อกคอยล์เหล็ก ฉนวนพียู และควบคุมสายการผลิตหลังคาจนถึงการจัดส่งหน้างาน ปฏิบัติงานเฉพาะหน้าที่คลังและผลิต',
    descriptionEn: 'Responsible for raw material coil coils, PU chemical inventory, factory production queue, and site deliveries.',
  },
  accounting: {
    id: 'accounting',
    nameTh: 'ฝ่ายบัญชีและการเงิน (Accounting & Finance)',
    nameEn: 'Accounting & Finance Manager',
    badgeTh: 'บัญชี & ลูกหนี้ AR',
    badgeEn: 'AR & Reconciliation',
    canDoTh: [
      'ติดตามยอดลูกหนี้ขายเชื่อ (Credit Invoices) และช่วงอายุหนี้ AR Aging (0-30, 31-60, 61-90, 90+ วัน)',
      'ตรวจสอบและจัดการใบรับมัดจำ (Deposit Receipts) ตัดยอดใช้จริงเทียบกับใบกำกับสินค้า',
      'ตรวจสอบความถูกต้องของยอดขายเงินสดและภาษีมูลค่าเพิ่ม (VAT 7%)',
      'นำเข้าไฟล์ Express หมวดขายเชื่อและใบรับมัดจำ',
      'ดูข้อเสนอแนะด้านการติดตามหนี้ค้างชำระและการป้องกันหนี้เสีย',
      'ตอบกลับข้อสั่งการของ CEO เกี่ยวกับการเงินและบัญชี',
    ],
    canDoEn: [
      'Track outstanding Credit Invoices across AR aging brackets (0-30, 31-60, 61-90, 90+ days)',
      'Manage and reconcile Deposit Receipts against billed invoices',
      'Verify cash sales receipts, tax compliance, and VAT 7% calculations',
      'Import Express credit and deposit CSV ledgers',
      'Review automated collection priorities to prevent aging bad debts',
      'Reply to CEO directives regarding financial audits and receivable collections',
    ],
    cannotDoTh: [
      'ไม่สามารถเปลี่ยนสถานะคิวงานผลิตในโรงงานได้ (เป็นหน้าที่ของฝ่ายคลัง/ผลิต)',
      'ไม่สามารถออกใบเสนอราคาลดต่ำกว่าเกณฑ์กำไรขั้นต่ำได้โดยไม่มีการอนุมัติจาก CEO',
      'ไม่สามารถล้างฐานข้อมูลระบบทั้งหมดได้โดยไม่มีรหัส CEO',
    ],
    cannotDoEn: [
      'Cannot modify factory production schedule or delivery job statuses',
      'Cannot override quote margin floors without CEO authorization',
      'Cannot perform full system wipes without verified CEO credentials',
    ],
    descriptionTh: 'ควบคุมการเงิน บัญชีลูกหนี้ การเรียกเก็บหนี้ และเงินมัดจำค่าสั่งผลิตหลังคา ปฏิบัติงานเฉพาะหน้าที่การเงินและบัญชี',
    descriptionEn: 'Oversees company cash flow, customer credit limits, overdue debt collections, and deposit receipt reconciliation.',
  },
};

export const INITIAL_CEO_DIRECTIVES: CeoDirective[] = [
  {
    id: 'dir-1',
    title: 'ตรวจสอบความถูกต้องของไฟล์ Express 3 CSV และยืนยันยอดเงินมัดจำคงเหลือ',
    targetRole: 'admin',
    priority: 'urgent',
    content:
      'แอดมินช่วยตรวจสอบไฟล์ CSV ที่นำเข้าวันนี้ ให้มั่นใจว่ายอดขายเงินสด ฿1,326,500 และเงินมัดจำคงเหลือ ฿415,000 ตรงกับยอดในระบบ Express ก่อนปิดรอบรายงานสิ้นวัน',
    createdAt: '2026-09-20 09:30',
    dueDate: '2026-09-20 17:00',
    status: 'in_progress',
    createdBy: 'คุณชาเอม (CEO)',
    comments: [
      {
        id: 'c-1',
        author: 'คุณชาเอม (CEO)',
        role: 'ผู้บริหาร (CEO)',
        content: 'เน้นตรวจยอดของ บจก. สยามพาณิชย์ คอนสตรัคชั่น ด้วยครับ',
        timestamp: '2026-09-20 09:32',
      },
      {
        id: 'c-2',
        author: 'สมศักดิ์ (Admin)',
        role: 'ผู้ดูแลระบบ (Admin)',
        content: 'รับทราบครับคุณชาเอม ตรวจสอบเทียบกับ Express แล้วยอดตรงกันทุกประการ กำลังทำสรุปส่งให้ฝ่ายบัญชีครับ',
        timestamp: '2026-09-20 10:15',
      },
    ],
  },
  {
    id: 'dir-2',
    title: 'เร่งติดตามลูกหนี้เกินกำหนด 30 วัน ด่วนที่สุด (ป้องกันหนี้เสีย)',
    targetRole: 'accounting',
    priority: 'urgent',
    content:
      'ฝ่ายบัญชีประสานงานกับผู้รับเหมา บจก. สยามพาณิชย์ คอนสตรัคชั่น ยอดค้าง ฿162,150 ที่เกินกำหนด 31 วันแล้ว และช่างเกรียงศักดิ์ ยอด ฿84,500 ขอทราบผลการนัดชำระภายในวันศุกร์นี้',
    createdAt: '2026-09-19 14:00',
    dueDate: '2026-09-22 12:00',
    status: 'in_progress',
    createdBy: 'คุณชาเอม (CEO)',
    comments: [
      {
        id: 'c-3',
        author: 'วิภา (ฝ่ายบัญชี)',
        role: 'ฝ่ายบัญชีและการเงิน',
        content: 'ติดต่อไปแล้วค่ะ ทาง บจก. สยามพาณิชย์ แจ้งว่ารอเบิกงวดงานจากโครงการ จะโอนชำระงวดแรก ฿100,000 ในวันพฤหัสบดีนี้ค่ะ',
        timestamp: '2026-09-19 16:30',
      },
    ],
  },
  {
    id: 'dir-3',
    title: 'จัดโปรโมชั่นเร่งระบายสต็อก เมทัลชีทอลูซิงค์ 0.35 มม. ค้างสต็อกเกิน 90 วัน',
    targetRole: 'sales',
    priority: 'high',
    content:
      'ฝ่ายขายร่วมกับฝ่ายคลัง: ตอนนี้มีสินค้าค้างสต็อกใน Push List รหัส MS-760-035-AZ จำนวน 450 เมตร มูลค่ากว่า ฿54,000 ให้จัดทำแคมเปญเสนอราคาพิเศษแก่ช่างติดตั้งหลังคาขาประจำด่วน',
    createdAt: '2026-09-18 11:20',
    dueDate: '2026-09-25 18:00',
    status: 'pending',
    createdBy: 'คุณชาเอม (CEO)',
    comments: [
      {
        id: 'c-4',
        author: 'ธีรศักดิ์ (ฝ่ายขาย)',
        role: 'ผู้จัดการฝ่ายขาย',
        content: 'กำลังคัดเลือกรายชื่อช่างติดตั้ง 5 รายที่กำลังมีงานโกดังแถวสุพรรณบุรีเพื่อเสนอแพ็คเกจนี้ครับ',
        timestamp: '2026-09-18 14:10',
      },
    ],
  },
];
