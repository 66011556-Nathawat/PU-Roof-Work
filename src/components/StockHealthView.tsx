import React, { useState, useMemo } from 'react';
import {
  Boxes,
  AlertOctagon,
  Calculator,
  Zap,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { StockItem } from '../types';
import { formatTHB } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SortDirection, sortData } from '../utils/sorting';
import { SortableHeader } from './SortableHeader';

interface StockHealthViewProps {
  stockItems: StockItem[];
  openQuoteModal: () => void;
}

export const StockHealthView: React.FC<StockHealthViewProps> = ({
  stockItems,
  openQuoteModal,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Track B Requirement (Slide 30): Sorted by risk weight
  const riskWeight: Record<string, number> = {
    out: 1,
    low: 2,
    overstock: 3,
    healthy: 4,
  };

  const handleSort = (field: string) => {
    if (sortKey === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(field);
      setSortDirection('asc');
    }
  };

  const filteredStock = useMemo(() => {
    const filtered = stockItems.filter((item) => {
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      return true;
    });

    if (sortKey === 'status') {
      return [...filtered].sort((a, b) => {
        const diff = (riskWeight[a.status] || 99) - (riskWeight[b.status] || 99);
        return sortDirection === 'asc' ? diff : -diff;
      });
    }

    return sortData(filtered, sortKey, sortDirection);
  }, [stockItems, filterCategory, filterStatus, sortKey, sortDirection]);

  // Reorder suggestion list (Track B Slide 30)
  const reorderList = stockItems.filter(
    (i) => i.status === 'out' || i.status === 'low' || i.stockQty <= i.reorderPoint
  );

  // Push list: Slow moving items with days of cover > 90 days (Track B Slide 30)
  const pushList = stockItems.filter((i) => i.daysOfCover > 90 || i.status === 'overstock');

  // Card theme helper
  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  const categoryOptions = [
    { id: 'all', label: t.stock.filterAll },
    { id: 'หลังคา PU โฟม', label: t.stock.filterPu },
    { id: 'คอยล์เหล็ก', label: t.stock.filterCoil },
    { id: 'ครอบและอุปกรณ์', label: t.stock.filterFlashing },
    { id: 'สกรูและฉนวน', label: t.stock.filterFasteners },
  ];

  const statusOptions = [
    { id: 'all', label: t.all },
    { id: 'out', label: t.stock.statusOut },
    { id: 'low', label: t.stock.statusLow },
    { id: 'overstock', label: t.stock.statusOverstock },
    { id: 'healthy', label: t.stock.statusHealthy },
  ];

  const getStatusLabel = (st: StockItem['status']) => {
    switch (st) {
      case 'out':
        return t.stock.statusOut;
      case 'low':
        return t.stock.statusLow;
      case 'overstock':
        return t.stock.statusOverstock;
      case 'healthy':
        return t.stock.statusHealthy;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Strategy Summary */}
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            {lang === 'th' ? 'Track B: จัดการสต็อกและการเสนอราคา' : 'Track B: Inventory & Quote Engine'}
          </span>
          <h3 className="text-xl font-bold mt-2 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-sky-500" />
            {t.stock.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'th'
              ? 'เรียงลำดับตามระดับความเสี่ยง (สินค้าขาดสต็อก > ใกล้หมด > ค้างสต็อก > ปกติ) พร้อมการคำนวณวันครอบคลุมสต็อก (Days of Cover) และจุดสั่งซื้อซ้ำ (Reorder Point)'
              : 'Sorted by operational risk hierarchy (Out of Stock > Low Stock > Overstock > Healthy) with Days of Cover & Reorder Points'}
          </p>
        </div>

        <button
          onClick={openQuoteModal}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-md border border-amber-500/40 flex items-center gap-2 transition"
        >
          <Calculator className="w-4 h-4" />
          <span>{t.calculateQuote}</span>
        </button>
      </div>

      {/* 2 Quick Alert Cards: Reorder Suggestions & Push List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reorder Suggestions */}
        <div
          className={`border rounded-2xl p-5 ${
            isDark
              ? 'bg-slate-900 border-rose-900/40'
              : 'bg-white border-rose-200 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <h4 className="text-sm font-bold">
                {t.stock.reorderAlert}
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold">
              {reorderList.length} {t.items}
            </span>
          </div>

          <div
            className={`mt-3 divide-y max-h-60 overflow-y-auto pr-1 ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}
          >
            {reorderList.map((item) => (
              <div key={item.sku} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-3">
                  <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-[11px] flex items-center gap-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="font-mono font-medium">{item.sku}</span>
                    <span>•</span>
                    <span className="text-rose-500 font-medium">
                      {lang === 'th'
                        ? `คงเหลือ ${item.stockQty} ${item.unit} (คลุมได้ ${item.daysOfCover} วัน)`
                        : `Stock: ${item.stockQty} ${item.unit} (${item.daysOfCover} DoC)`}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-600 font-semibold text-[11px]">
                    +{item.suggestedOrderQty} {item.unit}
                  </span>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Lead time {item.leadTimeDays} {lang === 'th' ? 'วัน' : 'days'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push List: Slow Moving > 90 Days */}
        <div
          className={`border rounded-2xl p-5 ${
            isDark
              ? 'bg-slate-900 border-amber-900/40'
              : 'bg-white border-amber-200 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold">
                {t.stock.pushList}
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 font-semibold">
              {pushList.length} {t.items}
            </span>
          </div>

          <div
            className={`mt-3 divide-y max-h-60 overflow-y-auto pr-1 ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}
          >
            {pushList.map((item) => (
              <div key={item.sku} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-3">
                  <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-[11px] flex items-center gap-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="font-mono font-medium">{item.sku}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">
                      {lang === 'th'
                        ? `คงเหลือ ${item.stockQty} ${item.unit} (DoC: ${item.daysOfCover} วัน)`
                        : `Stock: ${item.stockQty} ${item.unit} (${item.daysOfCover} DoC)`}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-700 font-semibold text-[11px]">
                    {lang === 'th' ? 'แนะนำลด 10%' : 'Push Promo -10%'}
                  </span>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.stock.unitCost}: {formatTHB(item.cost)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stock Health Table */}
      <div className={`border rounded-2xl overflow-hidden ${cardCls}`}>
        {/* Table Filters & Header */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.filter}:
            </span>
            {categoryOptions.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filterCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-white bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.status}:
              </span>
              {statusOptions.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    filterStatus === st.id
                      ? isDark
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-800 text-white'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Reset to Track B Risk Sorting */}
            {(sortKey !== 'status' || sortDirection !== 'asc') && (
              <button
                onClick={() => {
                  setSortKey('status');
                  setSortDirection('asc');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-amber-400 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-amber-600 hover:bg-slate-100'
                }`}
                title={lang === 'th' ? 'คืนค่าเรียงตามความเสี่ยง (Track B)' : 'Reset to Track B Risk Priority'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.sortDefault}</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
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
                  label={t.status}
                  field="status"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.stock.sku}
                  field="sku"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.stock.productName}
                  field="name"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.stock.category}
                  field="category"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t.stock.currentStock}
                  field="stockQty"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.stock.avgDailyUsage}
                  field="avgDailyUsage"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.stock.daysOfCover}
                  field="daysOfCover"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.stock.reorderPoint}
                  field="reorderPoint"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.stock.unitCost}
                  field="unitCost"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortableHeader
                  label={t.stock.sellingPrice}
                  field="sellingPrice"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {filteredStock.map((item) => (
                <tr
                  key={item.sku}
                  className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        item.status === 'out'
                          ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                          : item.status === 'low'
                          ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                          : item.status === 'overstock'
                          ? 'bg-purple-500/15 text-purple-700 border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'out'
                            ? 'bg-rose-500'
                            : item.status === 'low'
                            ? 'bg-amber-500'
                            : item.status === 'overstock'
                            ? 'bg-purple-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-mono font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.sku}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`font-medium max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.name}
                    </div>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.category}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.stockQty}{' '}
                    <span className={`text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {item.avgDailyUsage}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold ${
                        item.daysOfCover < item.leadTimeDays
                          ? 'text-rose-500'
                          : item.daysOfCover > 90
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {item.daysOfCover} {lang === 'th' ? 'วัน' : 'days'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.reorderPoint}
                  </td>
                  <td className={`px-4 py-3 text-right ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {formatTHB(item.cost)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-sky-500">
                    {formatTHB(item.sellingPrice)}
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
