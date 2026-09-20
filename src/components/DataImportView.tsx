import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  Search,
  RotateCcw,
} from 'lucide-react';
import { CashSale, CreditInvoice, DepositReceipt, UserRoleId } from '../types';
import { ROLE_CAPABILITIES } from '../data/rolePermissions';
import {
  parseCashSalesCSV,
  parseCreditInvoicesCSV,
  parseDepositReceiptsCSV,
  detectCSVType,
} from '../utils/csvParser';
import {
  SAMPLE_CSV_CASH_SALES,
  SAMPLE_CSV_INVOICES,
  SAMPLE_CSV_DEPOSITS,
} from '../data/sampleData';
import { formatTHB } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SortDirection, sortData } from '../utils/sorting';
import { SortableHeader } from './SortableHeader';
import { Shield, Lock, Check } from 'lucide-react';

interface DataImportViewProps {
  cashSales: CashSale[];
  creditInvoices: CreditInvoice[];
  depositReceipts: DepositReceipt[];
  onUpdateData: (
    cashSales: CashSale[],
    creditInvoices: CreditInvoice[],
    depositReceipts: DepositReceipt[]
  ) => void;
  onResetSample: () => void;
  onClearAll: () => void;
  currentRole: UserRoleId;
  onRequestCeoUnlock?: () => void;
}

export const DataImportView: React.FC<DataImportViewProps> = ({
  cashSales,
  creditInvoices,
  depositReceipts,
  onUpdateData,
  onResetSample,
  onClearAll,
  currentRole,
  onRequestCeoUnlock,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const roleCaps = ROLE_CAPABILITIES[currentRole] || {
    canImportExpressCsv: true,
    canClearSystemData: true,
    canResetSampleData: true,
  };

  const handleChooseFilesClick = () => {
    if (!roleCaps.canImportExpressCsv) {
      notify(
        'error',
        lang === 'th'
          ? '🔒 สิทธิ์ถูกจำกัด: เฉพาะ CEO, Admin และฝ่ายบัญชีเท่านั้นที่สามารถนำเข้าไฟล์ Express ได้ (ฝ่ายขายและคลังสินค้าทำเฉพาะหน้าที่)'
          : '🔒 Restricted: Only CEO, Admin, and Accounting can import Express files.'
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const handleResetSampleClick = () => {
    if (!roleCaps.canResetSampleData) {
      notify(
        'error',
        lang === 'th'
          ? '🔒 สิทธิ์ถูกจำกัด: เฉพาะ CEO และ Admin เท่านั้นที่สามารถรีเซ็ตข้อมูลระบบได้'
          : '🔒 Restricted: Only CEO and Admin can reset sample data.'
      );
      return;
    }
    onResetSample();
  };

  const handleClearAllClick = () => {
    if (!roleCaps.canClearSystemData) {
      notify(
        'error',
        lang === 'th'
          ? '🔒 ต้องใช้สิทธิ์ CEO (รหัส 1234): บทบาทอื่นไม่ได้รับอนุญาตให้ล้างฐานข้อมูลระบบ'
          : '🔒 CEO Authentication Required (PIN: 1234): Only CEO can clear system data.'
      );
      if (onRequestCeoUnlock) {
        onRequestCeoUnlock();
      }
      return;
    }
    onClearAll();
  };
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'cash' | 'invoice' | 'deposit'>('cash');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sorting state for the 3 preview tables
  const [cashSortKey, setCashSortKey] = useState<string>('date');
  const [cashSortDir, setCashSortDir] = useState<SortDirection>('desc');

  const [invSortKey, setInvSortKey] = useState<string>('date');
  const [invSortDir, setInvSortDir] = useState<SortDirection>('desc');

  const [depSortKey, setDepSortKey] = useState<string>('date');
  const [depSortDir, setDepSortDir] = useState<SortDirection>('desc');

  const handleCashSort = (field: string) => {
    if (cashSortKey === field) {
      setCashSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setCashSortKey(field);
      setCashSortDir(field === 'totalAmount' || field === 'quantity' || field === 'unitPrice' ? 'desc' : 'asc');
    }
  };

  const handleInvSort = (field: string) => {
    if (invSortKey === field) {
      setInvSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setInvSortKey(field);
      setInvSortDir(field === 'outstandingBalance' || field === 'grandTotal' || field === 'paidAmount' ? 'desc' : 'asc');
    }
  };

  const handleDepSort = (field: string) => {
    if (depSortKey === field) {
      setDepSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setDepSortKey(field);
      setDepSortDir(field === 'remainingAmount' || field === 'depositAmount' || field === 'appliedAmount' ? 'desc' : 'asc');
    }
  };

  const sortedCashSales = useMemo(() => {
    const filtered = cashSales.filter(
      (r) =>
        !searchQuery ||
        r.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return sortData(filtered, cashSortKey, cashSortDir);
  }, [cashSales, searchQuery, cashSortKey, cashSortDir]);

  const sortedCreditInvoices = useMemo(() => {
    const filtered = creditInvoices.filter(
      (r) =>
        !searchQuery ||
        r.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.projectName && r.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return sortData(filtered, invSortKey, invSortDir);
  }, [creditInvoices, searchQuery, invSortKey, invSortDir]);

  const sortedDepositReceipts = useMemo(() => {
    const filtered = depositReceipts.filter(
      (r) =>
        !searchQuery ||
        r.depositNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return sortData(filtered, depSortKey, depSortDir);
  }, [depositReceipts, searchQuery, depSortKey, depSortDir]);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleFiles = async (files: FileList | File[]) => {
    let updatedCash = [...cashSales];
    let updatedInvoices = [...creditInvoices];
    let updatedDeposits = [...depositReceipts];
    let processedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const detectedType = detectCSVType(file.name, text);

        if (detectedType === 'cash') {
          const parsed = parseCashSalesCSV(text);
          if (parsed.length > 0) {
            updatedCash = parsed;
            processedCount++;
          } else {
            errors.push(`File ${file.name} contains no valid cash sales data`);
          }
        } else if (detectedType === 'invoice') {
          const parsed = parseCreditInvoicesCSV(text);
          if (parsed.length > 0) {
            updatedInvoices = parsed;
            processedCount++;
          } else {
            errors.push(`File ${file.name} contains no valid credit invoice data`);
          }
        } else if (detectedType === 'deposit') {
          const parsed = parseDepositReceiptsCSV(text);
          if (parsed.length > 0) {
            updatedDeposits = parsed;
            processedCount++;
          } else {
            errors.push(`File ${file.name} contains no valid deposit receipt data`);
          }
        } else {
          // Fallback: try parsing all and see which returns valid items
          const tryCash = parseCashSalesCSV(text);
          const tryInv = parseCreditInvoicesCSV(text);
          const tryDep = parseDepositReceiptsCSV(text);

          if (tryCash.length >= tryInv.length && tryCash.length >= tryDep.length && tryCash.length > 0) {
            updatedCash = tryCash;
            processedCount++;
          } else if (tryInv.length >= tryDep.length && tryInv.length > 0) {
            updatedInvoices = tryInv;
            processedCount++;
          } else if (tryDep.length > 0) {
            updatedDeposits = tryDep;
            processedCount++;
          } else {
            errors.push(`Cannot detect CSV type for ${file.name}`);
          }
        }
      } catch (err: any) {
        errors.push(`Error parsing ${file.name}: ${err.message}`);
      }
    }

    if (processedCount > 0) {
      onUpdateData(updatedCash, updatedInvoices, updatedDeposits);
      notify(
        'success',
        lang === 'th'
          ? `นำเข้าไฟล์สำเร็จแล้ว ${processedCount} ไฟล์ (ข้อมูลอัปเดตและบันทึกอัตโนมัติ)`
          : `Successfully imported ${processedCount} file(s)`
      );
    }
    if (errors.length > 0) {
      notify('error', errors.join(', '));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const downloadSampleFile = (type: 'cash' | 'invoice' | 'deposit') => {
    let content = '';
    let filename = '';
    if (type === 'cash') {
      content = SAMPLE_CSV_CASH_SALES;
      filename = 'PU_Roof_Works_Cash_Sales_Express.csv';
    } else if (type === 'invoice') {
      content = SAMPLE_CSV_INVOICES;
      filename = 'PU_Roof_Works_Credit_Invoices_Express.csv';
    } else {
      content = SAMPLE_CSV_DEPOSITS;
      filename = 'PU_Roof_Works_Deposit_Receipts_Express.csv';
    }

    // Add UTF-8 BOM so Excel opens Thai characters without garbling
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('info', lang === 'th' ? `ดาวน์โหลดเทมเพลต ${filename} เรียบร้อยแล้ว` : `Downloaded template ${filename}`);
  };

  // Totals calculations
  const totalCashAmount = cashSales.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalCreditAmount = creditInvoices.reduce((sum, item) => sum + item.grandTotal, 0);
  const totalOutstandingBalance = creditInvoices.reduce(
    (sum, item) => sum + item.outstandingBalance,
    0
  );
  const totalRemainingDeposit = depositReceipts.reduce(
    (sum, item) => sum + item.remainingAmount,
    0
  );

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              : 'bg-sky-950/70 border-sky-500/50 text-sky-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Upload Card */}
      <div className={`border rounded-2xl overflow-hidden ${cardCls}`}>
        {/* Card Header */}
        <div
          className={`px-6 py-5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-slate-800/80 bg-slate-900' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {t.importView.title}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.importView.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              {lang === 'th' ? 'สถานะข้อมูล: พร้อมวิเคราะห์' : 'Status: Ready'}{' '}
              ({cashSales.length + creditInvoices.length + depositReceipts.length} {t.items})
            </span>
          </div>
        </div>

        {/* Card Body - Drag & Drop Zone */}
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all flex flex-col items-center justify-center ${
              dragActive
                ? isDark
                  ? 'border-sky-400 bg-sky-950/20'
                  : 'border-sky-500 bg-sky-50'
                : isDark
                ? 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center mb-3 ${
                isDark
                  ? 'border-slate-600 bg-slate-800/60 text-slate-300'
                  : 'border-slate-300 bg-white text-slate-600 shadow-xs'
              }`}
            >
              <UploadCloud className="w-6 h-6 text-sky-500" />
            </div>

            <h4 className={`text-base font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t.importView.dropzoneTitle}
            </h4>
            <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.importView.dropzoneSubtitle}
            </p>

            {/* Action Buttons with RBAC protection */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleChooseFilesClick}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition flex items-center gap-2 ${
                  roleCaps.canImportExpressCsv
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
                title={!roleCaps.canImportExpressCsv ? 'เฉพาะ CEO, Admin และบัญชี เท่านั้น' : undefined}
              >
                {!roleCaps.canImportExpressCsv ? (
                  <Lock className="w-4 h-4 text-amber-400" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>{t.importView.chooseFiles}</span>
              </button>

              <button
                type="button"
                onClick={handleResetSampleClick}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition flex items-center gap-2 ${
                  !roleCaps.canResetSampleData
                    ? 'opacity-60 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    : isDark
                    ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                    : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-300 shadow-2xs'
                }`}
              >
                {!roleCaps.canResetSampleData ? (
                  <Lock className="w-4 h-4 text-slate-500" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                )}
                <span>{t.importView.useSampleData}</span>
              </button>

              <button
                type="button"
                onClick={handleClearAllClick}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition flex items-center gap-2 ${
                  !roleCaps.canClearSystemData
                    ? 'opacity-70 bg-slate-900 border-slate-800 text-slate-500'
                    : isDark
                    ? 'text-slate-400 hover:text-rose-300 bg-slate-800/40 hover:bg-rose-950/40 border-slate-800 hover:border-rose-800/50'
                    : 'text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-300 shadow-2xs'
                }`}
                title={!roleCaps.canClearSystemData ? 'ต้องใช้รหัสผ่าน CEO (1234)' : undefined}
              >
                {!roleCaps.canClearSystemData ? (
                  <Lock className="w-4 h-4 text-amber-500" />
                ) : (
                  <Trash2 className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {t.importView.clearAll} {!roleCaps.canClearSystemData && '(CEO 1234)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Dedicated Express CSV File Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slot 1: Cash Sales */}
        <div className={`border rounded-xl p-5 flex flex-col justify-between transition ${cardCls}`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {lang === 'th' ? 'ไฟล์ที่ 1 : ขายเงินสด' : 'File 1: Cash Sales'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {cashSales.length} {t.items}
              </span>
            </div>

            <h4 className="text-base font-semibold mt-3 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              {t.importView.slotCashTitle}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.importView.slotCashDesc}
            </p>

            <div className={`mt-4 p-3 rounded-lg border text-xs space-y-1 ${subCardCls}`}>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'ยอดขายเงินสดรวม:' : 'Total Cash:'}</span>
                <span className="font-semibold text-emerald-500">
                  {formatTHB(totalCashAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'ความสมบูรณ์:' : 'Readiness:'}</span>
                <span className="font-medium">
                  {cashSales.length > 0
                    ? (lang === 'th' ? '✓ นำเข้าแล้ว' : '✓ Loaded')
                    : (lang === 'th' ? 'รอไฟล์' : 'Pending')}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800/80' : 'border-slate-100'
            }`}
          >
            <button
              onClick={() => downloadSampleFile('cash')}
              className="text-xs text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.importView.downloadTemplate}</span>
            </button>
            <button
              onClick={() => {
                setActivePreviewTab('cash');
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {lang === 'th' ? 'ดูตาราง' : 'View Table'}
            </button>
          </div>
        </div>

        {/* Slot 2: Invoices / Credit Sales */}
        <div className={`border rounded-xl p-5 flex flex-col justify-between transition ${cardCls}`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                {lang === 'th' ? 'ไฟล์ที่ 2 : ขายเชื่อ & ลูกหนี้' : 'File 2: Credit Invoices'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {creditInvoices.length} {t.items}
              </span>
            </div>

            <h4 className="text-base font-semibold mt-3 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-500" />
              {t.importView.slotInvoiceTitle}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.importView.slotInvoiceDesc}
            </p>

            <div className={`mt-4 p-3 rounded-lg border text-xs space-y-1 ${subCardCls}`}>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'ยอดวางบิลรวม:' : 'Total Invoiced:'}</span>
                <span className="font-semibold text-sky-500">
                  {formatTHB(totalCreditAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'ยอดหนี้ค้างชำระ:' : 'Total AR:'}</span>
                <span className="font-semibold text-rose-500">
                  {formatTHB(totalOutstandingBalance)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800/80' : 'border-slate-100'
            }`}
          >
            <button
              onClick={() => downloadSampleFile('invoice')}
              className="text-xs text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.importView.downloadTemplate}</span>
            </button>
            <button
              onClick={() => {
                setActivePreviewTab('invoice');
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {lang === 'th' ? 'ดูตาราง' : 'View Table'}
            </button>
          </div>
        </div>

        {/* Slot 3: Deposit Receipts */}
        <div className={`border rounded-xl p-5 flex flex-col justify-between transition ${cardCls}`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                {lang === 'th' ? 'ไฟล์ที่ 3 : ใบรับมัดจำ' : 'File 3: Deposit Receipts'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {depositReceipts.length} {t.items}
              </span>
            </div>

            <h4 className="text-base font-semibold mt-3 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              {t.importView.slotDepositTitle}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.importView.slotDepositDesc}
            </p>

            <div className={`mt-4 p-3 rounded-lg border text-xs space-y-1 ${subCardCls}`}>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'ยอดมัดจำคงเหลือ:' : 'Remaining Deposits:'}</span>
                <span className="font-semibold text-amber-500">
                  {formatTHB(totalRemainingDeposit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'th' ? 'รายการคงค้าง:' : 'Active items:'}</span>
                <span className="font-medium">
                  {depositReceipts.filter((d) => d.status === 'คงเหลือ').length} {t.items}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800/80' : 'border-slate-100'
            }`}
          >
            <button
              onClick={() => downloadSampleFile('deposit')}
              className="text-xs text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.importView.downloadTemplate}</span>
            </button>
            <button
              onClick={() => {
                setActivePreviewTab('deposit');
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {lang === 'th' ? 'ดูตาราง' : 'View Table'}
            </button>
          </div>
        </div>
      </div>

      {/* Ingested Data Inspection Table Card */}
      <div className={`border rounded-2xl overflow-hidden ${cardCls}`}>
        {/* Table Tab Selector */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePreviewTab('cash')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'cash'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              1. {t.tabCashSales} ({cashSales.length})
            </button>
            <button
              onClick={() => setActivePreviewTab('invoice')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'invoice'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              2. {t.tabInvoices} ({creditInvoices.length})
            </button>
            <button
              onClick={() => setActivePreviewTab('deposit')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'deposit'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              3. {t.tabDeposits} ({depositReceipts.length})
            </button>
          </div>

          {/* Search Box & Sort Reset */}
          <div className="flex items-center gap-2">
            {((activePreviewTab === 'cash' && (cashSortKey !== 'date' || cashSortDir !== 'desc')) ||
              (activePreviewTab === 'invoice' && (invSortKey !== 'date' || invSortDir !== 'desc')) ||
              (activePreviewTab === 'deposit' && (depSortKey !== 'date' || depSortDir !== 'desc'))) && (
              <button
                onClick={() => {
                  if (activePreviewTab === 'cash') {
                    setCashSortKey('date');
                    setCashSortDir('desc');
                  } else if (activePreviewTab === 'invoice') {
                    setInvSortKey('date');
                    setInvSortDir('desc');
                  } else {
                    setDepSortKey('date');
                    setDepSortDir('desc');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-sky-400 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-sky-600 hover:bg-slate-100'
                }`}
                title={lang === 'th' ? 'คืนค่าเรียงตามวันที่ล่าสุด' : 'Reset to Latest Date'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.sortDefault}</span>
              </button>
            )}

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'th' ? 'ค้นหาเลขที่, ลูกค้า, สินค้า...' : 'Search doc, customer, item...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none transition ${
                  isDark
                    ? 'bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-slate-700'
                    : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-sky-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Cash Sales Table */}
        {activePreviewTab === 'cash' && (
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead
                className={`border-b text-[11px] font-semibold uppercase ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                    : 'bg-slate-100/80 border-slate-200 text-slate-600'
                }`}
              >
                <tr>
                  <SortableHeader
                    label={t.docNo}
                    field="docNo"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                  />
                  <SortableHeader
                    label={t.date}
                    field="date"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                  />
                  <SortableHeader
                    label={t.customer}
                    field="customerName"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                  />
                  <SortableHeader
                    label={lang === 'th' ? 'สาขา' : 'Branch'}
                    field="branch"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                  />
                  <SortableHeader
                    label={t.product}
                    field="productName"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                  />
                  <SortableHeader
                    label={t.quantity}
                    field="quantity"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.unitPrice}
                    field="unitPrice"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.totalAmount}
                    field="totalAmount"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                    align="right"
                  />
                  <SortableHeader
                    label={lang === 'th' ? 'วิธีชำระ' : 'Payment'}
                    field="paymentMethod"
                    currentSortKey={cashSortKey}
                    currentDirection={cashSortDir}
                    onSort={handleCashSort}
                    align="center"
                  />
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {sortedCashSales.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-500">
                      {row.docNo}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {row.date}
                    </td>
                    <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {row.customerName}
                    </td>
                    <td className={`px-4 py-3 truncate max-w-[140px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {row.branch}
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className={`font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {row.productName}
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {row.sku}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {row.quantity} {row.unit}
                    </td>
                    <td className="px-4 py-3 text-right">{formatTHB(row.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-500">
                      {formatTHB(row.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] border ${
                          isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {row.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Invoices Table */}
        {activePreviewTab === 'invoice' && (
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead
                className={`border-b text-[11px] font-semibold uppercase ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                    : 'bg-slate-100/80 border-slate-200 text-slate-600'
                }`}
              >
                <tr>
                  <SortableHeader
                    label={t.ar.invoiceNo}
                    field="invoiceNo"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                  />
                  <SortableHeader
                    label={t.date}
                    field="date"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                  />
                  <SortableHeader
                    label={t.ar.dueDate}
                    field="dueDate"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                  />
                  <SortableHeader
                    label={t.ar.customer}
                    field="customerName"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                  />
                  <SortableHeader
                    label={t.ar.invoiceAmount}
                    field="grandTotal"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                    align="right"
                  />
                  <SortableHeader
                    label={lang === 'th' ? 'ชำระแล้ว' : 'Paid'}
                    field="paidAmount"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.ar.outstanding}
                    field="outstandingBalance"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.status}
                    field="status"
                    currentSortKey={invSortKey}
                    currentDirection={invSortDir}
                    onSort={handleInvSort}
                    align="center"
                  />
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {sortedCreditInvoices.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-sky-500">
                      {row.invoiceNo}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {row.date}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {row.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {row.customerName}
                      </div>
                      {row.projectName && (
                        <div className={`text-[10px] truncate max-w-[200px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {row.projectName}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatTHB(row.grandTotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-500 font-medium">
                      {formatTHB(row.paidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-500">
                      {formatTHB(row.outstandingBalance)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          row.status === 'ชำระแล้ว'
                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                            : row.status.includes('90') || row.status.includes('61-90')
                            ? 'bg-rose-500/15 text-rose-700 border-rose-500/30'
                            : row.status.includes('เกิน')
                            ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                            : isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Deposits Table */}
        {activePreviewTab === 'deposit' && (
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead
                className={`border-b text-[11px] font-semibold uppercase ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                    : 'bg-slate-100/80 border-slate-200 text-slate-600'
                }`}
              >
                <tr>
                  <SortableHeader
                    label={t.deposits.depositNo}
                    field="depositNo"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                  />
                  <SortableHeader
                    label={t.date}
                    field="date"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                  />
                  <SortableHeader
                    label={t.deposits.customer}
                    field="customerName"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                  />
                  <SortableHeader
                    label={t.deposits.jobDesc}
                    field="jobDescription"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                  />
                  <SortableHeader
                    label={t.deposits.depositAmount}
                    field="depositAmount"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.deposits.appliedAmount}
                    field="appliedAmount"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.deposits.remainingAmount}
                    field="remainingAmount"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                    align="right"
                  />
                  <SortableHeader
                    label={t.status}
                    field="status"
                    currentSortKey={depSortKey}
                    currentDirection={depSortDir}
                    onSort={handleDepSort}
                    align="center"
                  />
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {sortedDepositReceipts.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-amber-500">
                      {row.depositNo}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {row.date}
                    </td>
                    <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {row.customerName}
                    </td>
                    <td className={`px-4 py-3 max-w-[240px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div className="truncate">{row.jobDescription}</div>
                      {row.linkedInvoiceNo && (
                        <div className="text-[10px] text-sky-500 font-mono">
                          {lang === 'th' ? 'ตัดใช้กับ:' : 'Applied to:'} {row.linkedInvoiceNo}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatTHB(row.depositAmount)}
                    </td>
                    <td className={`px-4 py-3 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatTHB(row.appliedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-500">
                      {formatTHB(row.remainingAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          row.status === 'คงเหลือ'
                            ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                            : isDark
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {row.status === 'คงเหลือ' ? t.deposits.statusRemaining : t.deposits.statusFullyApplied}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
