import { CashSale, CreditInvoice, DepositReceipt } from '../types';

/**
 * Split CSV line respecting double quotes
 */
export function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Clean numeric strings (remove commas, currency symbols, whitespace)
 */
export function cleanNumber(val: string | number | undefined): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = val.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Auto-detect file type from CSV header or filename
 */
export function detectCSVType(
  filename: string,
  content: string
): 'cash' | 'invoice' | 'deposit' | 'unknown' {
  const lowerName = filename.toLowerCase();
  const firstLine = content.split('\n')[0].toLowerCase();

  // Check deposit receipts
  if (
    lowerName.includes('deposit') ||
    lowerName.includes('มัดจำ') ||
    firstLine.includes('มัดจำ') ||
    firstLine.includes('dp')
  ) {
    return 'deposit';
  }

  // Check credit invoices
  if (
    lowerName.includes('invoice') ||
    lowerName.includes('credit') ||
    lowerName.includes('ขายเชื่อ') ||
    lowerName.includes('ใบกำกับ') ||
    firstLine.includes('ใบกำกับ') ||
    firstLine.includes('ครบกำหนด') ||
    firstLine.includes('ลูกหนี้')
  ) {
    return 'invoice';
  }

  // Check cash sales
  if (
    lowerName.includes('cash') ||
    lowerName.includes('เงินสด') ||
    firstLine.includes('เงินสด') ||
    firstLine.includes('cs') ||
    firstLine.includes('ราคาต่อหน่วย')
  ) {
    return 'cash';
  }

  return 'unknown';
}

/**
 * Parse Cash Sales CSV
 */
export function parseCashSalesCSV(content: string): CashSale[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const rows: CashSale[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const row: CashSale = {
      id: `CS-IMP-${i}-${Date.now()}`,
      docNo: cols[0] || `CS-${i}`,
      date: cols[1] || new Date().toISOString().slice(0, 10),
      customerName: cols[2] || 'ลูกค้าทั่วไป',
      branch: cols[3] || 'สำนักงานใหญ่',
      sku: cols[4] || `SKU-${i}`,
      productName: cols[5] || cols[4] || 'สินค้าเมทัลชีท',
      category: cols[6] || 'หลังคา PU โฟม',
      quantity: cleanNumber(cols[7]) || 1,
      unit: cols[8] || 'เมตร',
      unitPrice: cleanNumber(cols[9]),
      discount: cleanNumber(cols[10]),
      totalAmount: cleanNumber(cols[11]) || cleanNumber(cols[7]) * cleanNumber(cols[9]),
      paymentMethod: (cols[12] as any) || 'โอนเงิน',
    };
    rows.push(row);
  }

  return rows;
}

/**
 * Parse Credit Invoices CSV
 */
export function parseCreditInvoicesCSV(content: string): CreditInvoice[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const rows: CreditInvoice[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 6) continue;

    const total = cleanNumber(cols[7]);
    const vat = cleanNumber(cols[8]);
    const grand = cleanNumber(cols[9]) || Math.round(total * 1.07);
    const paid = cleanNumber(cols[10]);
    const balance = cleanNumber(cols[11]) || Math.max(0, grand - paid);
    const statusText = cols[12]?.trim();

    let status: CreditInvoice['status'] = 'ยังไม่ครบกำหนด';
    let daysOverdue = 0;

    if (balance <= 0) {
      status = 'ชำระแล้ว';
    } else if (statusText?.includes('90')) {
      status = 'เกินกำหนด 90+ วัน';
      daysOverdue = 95;
    } else if (statusText?.includes('61-90') || statusText?.includes('60')) {
      status = 'เกินกำหนด 61-90 วัน';
      daysOverdue = 70;
    } else if (statusText?.includes('31-60') || statusText?.includes('30')) {
      status = 'เกินกำหนด 31-60 วัน';
      daysOverdue = 45;
    } else if (statusText?.includes('1-30') || statusText?.includes('เกิน')) {
      status = 'เกินกำหนด 1-30 วัน';
      daysOverdue = 15;
    }

    const row: CreditInvoice = {
      id: `INV-IMP-${i}-${Date.now()}`,
      invoiceNo: cols[0] || `IV-${i}`,
      date: cols[1] || new Date().toISOString().slice(0, 10),
      dueDate: cols[2] || cols[1] || new Date().toISOString().slice(0, 10),
      customerCode: cols[3] || `C-${i}`,
      customerName: cols[4] || 'ลูกค้าโครงการ',
      customerType: (cols[5] as any) || 'ผู้รับเหมา',
      projectName: cols[6] || undefined,
      totalAmount: total,
      vatAmount: vat,
      grandTotal: grand,
      paidAmount: paid,
      outstandingBalance: balance,
      status,
      daysOverdue,
    };
    rows.push(row);
  }

  return rows;
}

/**
 * Parse Deposit Receipts CSV
 */
export function parseDepositReceiptsCSV(content: string): DepositReceipt[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const rows: DepositReceipt[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const depositAmount = cleanNumber(cols[5]);
    const appliedAmount = cleanNumber(cols[6]);
    const remaining = cleanNumber(cols[7]) || Math.max(0, depositAmount - appliedAmount);
    const statusText = cols[8]?.trim();

    const status: DepositReceipt['status'] =
      remaining <= 0 || statusText?.includes('หมด')
        ? 'ใช้หมดแล้ว'
        : statusText?.includes('ยกเลิก')
        ? 'ยกเลิก'
        : 'คงเหลือ';

    const row: DepositReceipt = {
      id: `DEP-IMP-${i}-${Date.now()}`,
      depositNo: cols[0] || `DP-${i}`,
      date: cols[1] || new Date().toISOString().slice(0, 10),
      customerCode: cols[2] || `C-${i}`,
      customerName: cols[3] || 'ลูกค้าผู้สั่งผลิต',
      jobDescription: cols[4] || 'มัดจำสั่งผลิตหลังคา PU',
      depositAmount,
      appliedAmount,
      remainingAmount: remaining,
      status,
      linkedInvoiceNo: cols[9]?.trim() || undefined,
    };
    rows.push(row);
  }

  return rows;
}
