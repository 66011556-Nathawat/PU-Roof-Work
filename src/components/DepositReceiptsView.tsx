import React, { useState, useMemo } from 'react';
import { Receipt, Search, RotateCcw } from 'lucide-react';
import { DepositReceipt } from '../types';
import { formatTHB } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SortDirection, sortData } from '../utils/sorting';
import { SortableHeader } from './SortableHeader';

interface DepositReceiptsViewProps {
  depositReceipts: DepositReceipt[];
}

export const DepositReceiptsView: React.FC<DepositReceiptsViewProps> = ({
  depositReceipts,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'คงเหลือ' | 'ใช้หมดแล้ว'>('all');
  const [sortKey, setSortKey] = useState<string>('remainingAmount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: string) => {
    if (sortKey === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(field);
      setSortDirection(
        field === 'remainingAmount' || field === 'depositAmount' || field === 'appliedAmount'
          ? 'desc'
          : 'asc'
      );
    }
  };

  const totalDeposits = depositReceipts.reduce((acc, d) => acc + d.depositAmount, 0);
  const totalApplied = depositReceipts.reduce((acc, d) => acc + d.appliedAmount, 0);
  const totalRemaining = depositReceipts.reduce((acc, d) => acc + d.remainingAmount, 0);

  const filteredDeposits = useMemo(() => {
    const list = depositReceipts.filter((dep) => {
      if (statusFilter !== 'all' && dep.status !== statusFilter) return false;
      if (
        searchQuery &&
        !dep.depositNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !dep.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !dep.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return sortData(list, sortKey, sortDirection);
  }, [depositReceipts, statusFilter, searchQuery, sortKey, sortDirection]);

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/80 border-slate-800'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Summary */}
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            {lang === 'th' ? 'ระบบทะเบียนใบรับมัดจำ (Express Deposit Receipts)' : 'Deposit Receipts Ledger'}
          </span>
          <h3 className="text-xl font-bold mt-2 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            {t.deposits.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'th'
              ? 'ตรวจสอบเงินมัดจำรับล่วงหน้าสำหรับคำสั่งตัดรีดหลังคา PU โฟม สั่งสีพิเศษ และการตัดใช้ร่วมกับใบกำกับภาษีเมื่อส่งมอบสินค้า'
              : 'Track advance deposits received for custom PU foam roof profiling and verify invoice application upon dispatch'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`border rounded-xl px-4 py-2.5 text-right ${subCardCls}`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.deposits.remainingBalance}
            </div>
            <div className="text-lg font-bold text-amber-500">{formatTHB(totalRemaining)}</div>
          </div>
          <div className={`border rounded-xl px-4 py-2.5 text-right ${subCardCls}`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.deposits.usedDeposits}
            </div>
            <div className="text-lg font-bold text-emerald-500">{formatTHB(totalApplied)}</div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={`border rounded-2xl overflow-hidden ${cardCls}`}>
        {/* Table Filter & Search */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.status}:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                statusFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-xs font-semibold'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.all} ({depositReceipts.length})
            </button>
            <button
              onClick={() => setStatusFilter('คงเหลือ')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                statusFilter === 'คงเหลือ'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.deposits.statusRemaining} ({depositReceipts.filter((d) => d.status === 'คงเหลือ').length})
            </button>
            <button
              onClick={() => setStatusFilter('ใช้หมดแล้ว')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                statusFilter === 'ใช้หมดแล้ว'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t.deposits.statusFullyApplied} ({depositReceipts.filter((d) => d.status === 'ใช้หมดแล้ว').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(sortKey !== 'remainingAmount' || sortDirection !== 'desc') && (
              <button
                onClick={() => {
                  setSortKey('remainingAmount');
                  setSortDirection('desc');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-amber-400 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-amber-600 hover:bg-slate-100'
                }`}
                title={lang === 'th' ? 'คืนค่าเรียงตามยอดมัดจำคงเหลือสูงสุด' : 'Reset to Highest Remaining Deposit'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.sortDefault}</span>
              </button>
            )}

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'th' ? 'ค้นหาเลขมัดจำ, ชื่อลูกค้า...' : 'Search deposit no, customer...'}
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

        {/* Table */}
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
                  label={t.deposits.depositNo}
                  field="depositNo"
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
                  label={t.deposits.customer}
                  field="customerName"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.deposits.jobDesc}
                  field="jobDescription"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.deposits.depositAmount}
                  field="depositAmount"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.deposits.appliedAmount}
                  field="appliedAmount"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.deposits.remainingAmount}
                  field="remainingAmount"
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
                <SortableHeader
                  label={t.deposits.invoiceRef}
                  field="invoiceReference"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="center"
                />
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {filteredDeposits.map((dep) => (
                <tr
                  key={dep.id}
                  className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-amber-500">
                    {dep.depositNo}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {dep.date}
                  </td>
                  <td className={`px-4 py-3 font-medium max-w-[200px] truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {dep.customerName}
                  </td>
                  <td className={`px-4 py-3 max-w-[260px] truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {dep.jobDescription}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatTHB(dep.depositAmount)}
                  </td>
                  <td className={`px-4 py-3 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {formatTHB(dep.appliedAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-500">
                    {formatTHB(dep.remainingAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        dep.status === 'คงเหลือ'
                          ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                          : isDark
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {dep.status === 'คงเหลือ' ? t.deposits.statusRemaining : t.deposits.statusFullyApplied}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sky-500">
                    {dep.linkedInvoiceNo || '-'}
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
