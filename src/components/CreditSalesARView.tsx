import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  PhoneCall,
  Search,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { CreditInvoice } from '../types';
import { formatTHB } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SortDirection, sortData } from '../utils/sorting';
import { SortableHeader } from './SortableHeader';

interface CreditSalesARViewProps {
  creditInvoices: CreditInvoice[];
}

export const CreditSalesARView: React.FC<CreditSalesARViewProps> = ({ creditInvoices }) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('daysOverdue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    if (sortKey === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(field);
      setSortDirection(field === 'daysOverdue' || field === 'outstandingBalance' || field === 'grandTotal' ? 'desc' : 'asc');
    }
  };

  // Aging Buckets calculation
  const totalOutstanding = creditInvoices.reduce((acc, i) => acc + i.outstandingBalance, 0);
  const totalBilled = creditInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalCollected = creditInvoices.reduce((acc, i) => acc + i.paidAmount, 0);

  const bucketNotDue = creditInvoices
    .filter((i) => i.status === 'ยังไม่ครบกำหนด')
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  const bucket1_30 = creditInvoices
    .filter((i) => i.status === 'เกินกำหนด 1-30 วัน')
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  const bucket31_60 = creditInvoices
    .filter((i) => i.status === 'เกินกำหนด 31-60 วัน')
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  const bucket61_90 = creditInvoices
    .filter((i) => i.status === 'เกินกำหนด 61-90 วัน')
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  const bucket90Plus = creditInvoices
    .filter((i) => i.status === 'เกินกำหนด 90+ วัน')
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  const filteredInvoices = useMemo(() => {
    const list = creditInvoices.filter((inv) => {
      if (selectedStatus !== 'all' && inv.status !== selectedStatus) return false;
      if (
        searchQuery &&
        !inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(inv.projectName && inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });

    return sortData(list, sortKey, sortDirection);
  }, [creditInvoices, selectedStatus, searchQuery, sortKey, sortDirection]);

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/80 border-slate-800'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Summary */}
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            {lang === 'th' ? 'ระบบบริหารลูกหนี้การค้า (Express Accounts Receivable)' : 'Express AR Management'}
          </span>
          <h3 className="text-xl font-bold mt-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-500" />
            {t.ar.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'th'
              ? 'ตรวจสอบยอดหนี้คงค้างตามระยะเวลาครบกำหนด แยกตามช่วงอายุหนี้ เพื่อลดความเสี่ยงหนี้สูญและวางแผนติดตามทวงถาม'
              : 'Monitor aging buckets (Current, 1-30, 31-60, 61-90, 90+ days overdue) to minimize bad debt exposure'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`border rounded-xl px-4 py-2 text-right ${subCardCls}`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.ar.totalReceivables}
            </div>
            <div className="text-lg font-bold text-rose-500">{formatTHB(totalOutstanding)}</div>
          </div>
          <div className={`border rounded-xl px-4 py-2 text-right ${subCardCls}`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.ar.collectionRate}
            </div>
            <div className="text-lg font-bold text-emerald-500">
              {Math.round((totalCollected / totalBilled) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Aging Buckets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Bucket 1: Not Due */}
        <button
          onClick={() => setSelectedStatus(selectedStatus === 'ยังไม่ครบกำหนด' ? 'all' : 'ยังไม่ครบกำหนด')}
          className={`p-4 rounded-xl border text-left transition ${
            selectedStatus === 'ยังไม่ครบกำหนด'
              ? isDark
                ? 'bg-slate-800 border-sky-400 shadow-md'
                : 'bg-sky-50 border-sky-400 shadow-sm'
              : cardCls
          }`}
        >
          <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.ar.notDueYet}
          </div>
          <div className={`text-base font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatTHB(bucketNotDue)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium mt-1">
            {lang === 'th' ? 'อยู่ในเกณฑ์ปกติ' : 'Normal Standing'}
          </div>
        </button>

        {/* Bucket 2: 1-30 Days */}
        <button
          onClick={() => setSelectedStatus(selectedStatus === 'เกินกำหนด 1-30 วัน' ? 'all' : 'เกินกำหนด 1-30 วัน')}
          className={`p-4 rounded-xl border text-left transition ${
            selectedStatus === 'เกินกำหนด 1-30 วัน'
              ? isDark
                ? 'bg-slate-800 border-amber-400 shadow-md'
                : 'bg-amber-50 border-amber-400 shadow-sm'
              : cardCls
          }`}
        >
          <div className="text-[11px] text-amber-600 font-semibold">{t.ar.overdue1_30}</div>
          <div className="text-base font-bold text-amber-600 mt-1">{formatTHB(bucket1_30)}</div>
          <div className="text-[10px] text-amber-600/90 mt-1 font-medium">
            {lang === 'th' ? 'แจ้งเตือนทางไลน์/โทร' : 'Reminder Call'}
          </div>
        </button>

        {/* Bucket 3: 31-60 Days */}
        <button
          onClick={() => setSelectedStatus(selectedStatus === 'เกินกำหนด 31-60 วัน' ? 'all' : 'เกินกำหนด 31-60 วัน')}
          className={`p-4 rounded-xl border text-left transition ${
            selectedStatus === 'เกินกำหนด 31-60 วัน'
              ? isDark
                ? 'bg-slate-800 border-orange-400 shadow-md'
                : 'bg-orange-50 border-orange-400 shadow-sm'
              : cardCls
          }`}
        >
          <div className="text-[11px] text-orange-600 font-semibold">{t.ar.overdue31_60}</div>
          <div className="text-base font-bold text-orange-600 mt-1">{formatTHB(bucket31_60)}</div>
          <div className="text-[10px] text-orange-600 mt-1 font-medium">
            {lang === 'th' ? 'ระงับเปิดออเดอร์ใหม่' : 'Hold Credit Orders'}
          </div>
        </button>

        {/* Bucket 4: 61-90 Days */}
        <button
          onClick={() => setSelectedStatus(selectedStatus === 'เกินกำหนด 61-90 วัน' ? 'all' : 'เกินกำหนด 61-90 วัน')}
          className={`p-4 rounded-xl border text-left transition ${
            selectedStatus === 'เกินกำหนด 61-90 วัน'
              ? isDark
                ? 'bg-slate-800 border-rose-400 shadow-md'
                : 'bg-rose-50 border-rose-400 shadow-sm'
              : cardCls
          }`}
        >
          <div className="text-[11px] text-rose-500 font-semibold">{t.ar.overdue61_90}</div>
          <div className="text-base font-bold text-rose-500 mt-1">{formatTHB(bucket61_90)}</div>
          <div className="text-[10px] text-rose-600 mt-1 font-bold">
            {lang === 'th' ? 'ส่งหนังสือทวงถาม' : 'Demand Letter'}
          </div>
        </button>

        {/* Bucket 5: 90+ Days */}
        <button
          onClick={() => setSelectedStatus(selectedStatus === 'เกินกำหนด 90+ วัน' ? 'all' : 'เกินกำหนด 90+ วัน')}
          className={`p-4 rounded-xl border text-left transition ${
            selectedStatus === 'เกินกำหนด 90+ วัน'
              ? isDark
                ? 'bg-slate-800 border-rose-600 shadow-md'
                : 'bg-rose-100 border-rose-500 shadow-sm'
              : cardCls
          }`}
        >
          <div className="text-[11px] text-rose-600 font-bold">{t.ar.overdue90plus}</div>
          <div className="text-base font-bold text-rose-600 mt-1">{formatTHB(bucket90Plus)}</div>
          <div className="text-[10px] text-rose-600 mt-1 font-black">
            {lang === 'th' ? 'ฝ่ายกฎหมายพิจารณา' : 'Legal Action Review'}
          </div>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className={`border rounded-2xl overflow-hidden ${cardCls}`}>
        {/* Table Filters */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.filter}:
            </span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                selectedStatus === 'all'
                  ? 'bg-sky-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.all} ({creditInvoices.length})
            </button>
            <button
              onClick={() => setSelectedStatus('เกินกำหนด 1-30 วัน')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                selectedStatus === 'เกินกำหนด 1-30 วัน'
                  ? 'bg-amber-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.ar.overdue1_30}
            </button>
            <button
              onClick={() => setSelectedStatus('เกินกำหนด 90+ วัน')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                selectedStatus === 'เกินกำหนด 90+ วัน'
                  ? 'bg-rose-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.ar.overdue90plus}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(sortKey !== 'daysOverdue' || sortDirection !== 'desc') && (
              <button
                onClick={() => {
                  setSortKey('daysOverdue');
                  setSortDirection('desc');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-rose-400 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-rose-600 hover:bg-slate-100'
                }`}
                title={lang === 'th' ? 'คืนค่าเรียงตามวันค้างชำระสูงสุด' : 'Reset to Highest Overdue Days'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.sortDefault}</span>
              </button>
            )}

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'th' ? 'ค้นหาเลขที่บิล, ชื่อลูกค้า...' : 'Search invoice, customer...'}
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

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table
            className={`w-full text-left text-xs ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
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
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.date}
                  field="date"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.ar.dueDate}
                  field="dueDate"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.ar.customer}
                  field="customerName"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={lang === 'th' ? 'โครงการ' : 'Project'}
                  field="projectName"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.ar.invoiceAmount}
                  field="grandTotal"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={lang === 'th' ? 'ชำระแล้ว' : 'Paid'}
                  field="paidAmount"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.ar.outstanding}
                  field="outstandingBalance"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.status}
                  field="status"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="center"
                />
                <th className="px-4 py-3 text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-sky-500">
                    {inv.invoiceNo}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {inv.date}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {inv.dueDate}
                  </td>
                  <td className={`px-4 py-3 font-medium max-w-[180px] truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {inv.customerName}
                  </td>
                  <td className={`px-4 py-3 max-w-[180px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {inv.projectName || '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatTHB(inv.grandTotal)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-500 font-medium">
                    {formatTHB(inv.paidAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-rose-500">
                    {formatTHB(inv.outstandingBalance)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        inv.status === 'ชำระแล้ว'
                          ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                          : inv.status.includes('90') || inv.status.includes('61-90')
                          ? 'bg-rose-500/15 text-rose-700 border-rose-500/30'
                          : inv.status.includes('เกิน')
                          ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inv.outstandingBalance > 0 ? (
                      <button
                        onClick={() =>
                          alert(
                            `Contact log recorded for ${inv.customerName} (${inv.invoiceNo})\nOutstanding: ${formatTHB(
                              inv.outstandingBalance
                            )}`
                          )
                        }
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition inline-flex items-center gap-1 ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                            : 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300 shadow-2xs'
                        }`}
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{lang === 'th' ? 'ติดตาม' : 'Follow up'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-medium">
                        {lang === 'th' ? 'เรียบร้อย' : 'Settled'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
