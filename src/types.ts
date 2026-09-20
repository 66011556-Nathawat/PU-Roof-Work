export interface CashSale {
  id: string;
  docNo: string;
  date: string;
  customerName: string;
  branch: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'โอนเงิน' | 'เงินสด' | 'บัตรเครดิต';
}

export interface CreditInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  customerCode: string;
  customerName: string;
  customerType: 'ผู้รับเหมา' | 'ช่างทั่วไป' | 'โครงการ' | 'โรงงาน';
  projectName?: string;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  paidAmount: number;
  outstandingBalance: number;
  status: 'ยังไม่ครบกำหนด' | 'เกินกำหนด 1-30 วัน' | 'เกินกำหนด 31-60 วัน' | 'เกินกำหนด 61-90 วัน' | 'เกินกำหนด 90+ วัน' | 'ชำระแล้ว';
  daysOverdue: number;
}

export interface DepositReceipt {
  id: string;
  depositNo: string;
  date: string;
  customerCode: string;
  customerName: string;
  jobDescription: string;
  depositAmount: number;
  appliedAmount: number;
  remainingAmount: number;
  status: 'คงเหลือ' | 'ใช้หมดแล้ว' | 'ยกเลิก';
  linkedInvoiceNo?: string;
}

export interface StockItem {
  sku: string;
  name: string;
  category: 'หลังคา PU โฟม' | 'แผ่นเมทัลชีทเปลือย' | 'ครอบและอุปกรณ์' | 'สกรูและฉนวน' | 'คอยล์เหล็ก';
  cost: number;
  markupBand: number; // e.g. 0.25 (25%)
  sellingPrice: number;
  stockQty: number;
  unit: string;
  avgDailyUsage: number;
  leadTimeDays: number;
  safetyStock: number;
  daysOfCover: number;
  reorderPoint: number;
  suggestedOrderQty: number;
  status: 'out' | 'low' | 'healthy' | 'overstock';
}

export interface DeliveryJob {
  id: string;
  jobNo: string;
  customerName: string;
  location: string;
  itemsSummary: string;
  totalLengthMeters: number;
  orderDate: string;
  scheduledDate: string;
  status: 'รอรีดลอน' | 'กำลังติด PU' | 'พร้อมจัดส่ง' | 'จัดส่งเรียบร้อย';
  installerName: string;
  phone: string;
}

export interface QuoteLine {
  sku: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
  markupPercent: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  quoteNo: string;
  date: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  projectName: string;
  lines: QuoteLine[];
  labourHours: number;
  labourRate: number; // e.g. 450 THB/hr
  labourTotal: number;
  partsCost: number;
  totalCost: number;
  subtotal: number;
  discount: number;
  vat: number;
  grandTotal: number;
  grossMarginPercent: number;
  marginStatus: 'below_floor' | 'healthy' | 'above_ceiling';
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export interface ForecastSummary {
  salesToDate: number;
  workingDaysElapsed: number;
  workingDaysInMonth: number;
  runRateBase: number;
  seasonalMultiplier: number;
  adjustedProjection: number;
  lowRange: number;
  highRange: number;
  targetAmount: number;
  progressPercent: number;
  paceStatus: 'ahead' | 'on_track' | 'behind';
  lastMonthActual: number;
  growthVsLastMonth: number;
  mapeHistory: number;
}

export type ActiveTab =
  | 'overview'
  | 'stock'
  | 'jobs'
  | 'customers'
  | 'ar'
  | 'deposits'
  | 'recommendations'
  | 'import';

export type UserRoleId = 'ceo' | 'admin' | 'sales' | 'warehouse' | 'accounting';

export interface CeoDirectiveComment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface CeoDirective {
  id: string;
  title: string;
  targetRole: 'admin' | 'sales' | 'warehouse' | 'accounting' | 'all';
  priority: 'urgent' | 'high' | 'normal';
  content: string;
  createdAt: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdBy: string;
  comments: CeoDirectiveComment[];
}

export interface RoleCapability {
  canViewAllReports: boolean;
  canImportExpressCsv: boolean;
  canClearSystemData: boolean;
  canResetSampleData: boolean;
  canCreateDirectives: boolean;
  canReplyToDirectives: boolean;
  canCreateQuotes: boolean;
  canOverrideMarginGuardrails: boolean;
  canUpdateDeliveryStatus: boolean;
  canManageReceivablesAr: boolean;
  canManageDeposits: boolean;
  canExportFinancialLedgers: boolean;
}

