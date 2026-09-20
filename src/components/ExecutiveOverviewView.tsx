import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Coins,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { CashSale, CreditInvoice, DepositReceipt, StockItem } from '../types';
import {
  calculateForecastRange,
  calculateSeasonalIndex,
  runMathVerificationChecks,
  formatTHB,
  formatNumber,
} from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface ExecutiveOverviewViewProps {
  cashSales: CashSale[];
  creditInvoices: CreditInvoice[];
  depositReceipts: DepositReceipt[];
  stockItems: StockItem[];
  onNavigateToTab: (tab: any) => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  cashSales,
  creditInvoices,
  depositReceipts,
  stockItems,
  onNavigateToTab,
}) => {
  const { lang, t } = useLanguage();
  const { isDark, chartColors } = useTheme();

  // Operational simulation dates for September 2026
  const workingDaysElapsed = 16;
  const workingDaysInMonth = 22;
  const targetMonthlySales = 2200000; // ฿2.2M Target
  const lastMonthSales = 1950000; // ฿1.95M August actual

  // Calculate actual MTD sales
  const cashSalesTotal = cashSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const creditSalesTotal = creditInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const mtdSalesTotal = cashSalesTotal + creditSalesTotal;

  // Run rate & projection range (Track A pure function)
  const forecast = calculateForecastRange(
    mtdSalesTotal,
    workingDaysElapsed,
    workingDaysInMonth,
    9 // September
  );

  const seasonalFactor = calculateSeasonalIndex(9);
  const targetProgressPct = Math.round((mtdSalesTotal / targetMonthlySales) * 100);
  const expectedPacePct = Math.round((workingDaysElapsed / workingDaysInMonth) * 100);

  let directionSignal: 'ahead' | 'on_track' | 'behind' = 'on_track';
  if (targetProgressPct >= expectedPacePct + 5) directionSignal = 'ahead';
  else if (targetProgressPct < expectedPacePct - 5) directionSignal = 'behind';

  // Overdue Accounts Receivable calculations
  const overdueInvoices = creditInvoices.filter((i) => i.status.includes('เกิน'));
  const totalOverdueAmount = overdueInvoices.reduce((acc, i) => acc + i.outstandingBalance, 0);
  const criticalOverdueAmount = creditInvoices
    .filter((i) => i.status.includes('61-90') || i.status.includes('90+'))
    .reduce((acc, i) => acc + i.outstandingBalance, 0);

  // Active deposits
  const totalRemainingDeposits = depositReceipts.reduce(
    (acc, d) => acc + d.remainingAmount,
    0
  );

  // Stock risk summary
  const outOfStockCount = stockItems.filter((s) => s.status === 'out').length;
  const lowStockCount = stockItems.filter((s) => s.status === 'low').length;

  // Math verification checks for Track A (Slide 49)
  const mathChecks = runMathVerificationChecks();

  // Daily Trend Data (Simulation aggregated from sales to date)
  const dailyData = [
    { day: lang === 'th' ? '1 ก.ย.' : 'Sep 1', cash: 33700, credit: 0, total: 33700 },
    { day: lang === 'th' ? '3 ก.ย.' : 'Sep 3', cash: 3510, credit: 157290, total: 160800 },
    { day: lang === 'th' ? '5 ก.ย.' : 'Sep 5', cash: 2420, credit: 0, total: 2420 },
    { day: lang === 'th' ? '7 ก.ย.' : 'Sep 7', cash: 36600, credit: 419440, total: 456040 },
    { day: lang === 'th' ? '10 ก.ย.' : 'Sep 10', cash: 0, credit: 89880, total: 89880 },
    { day: lang === 'th' ? '12 ก.ย.' : 'Sep 12', cash: 41450, credit: 0, total: 41450 },
    { day: lang === 'th' ? '14 ก.ย.' : 'Sep 14', cash: 0, credit: 283550, total: 283550 },
    { day: lang === 'th' ? '16 ก.ย.' : 'Sep 16', cash: 12500, credit: 524300, total: 536800 },
    { day: lang === 'th' ? '18 ก.ย.' : 'Sep 18', cash: 31200, credit: 0, total: 31200 },
    { day: lang === 'th' ? '20 ก.ย.' : 'Sep 20', cash: 18900, credit: 198000, total: 216900 },
  ];

  // Category Breakdown Data
  const categoryData = [
    {
      category: lang === 'th' ? 'หลังคา PU โฟม' : 'PU Foam Roof',
      amount: 1180000,
      share: '61%',
      fill: '#10b981',
    },
    {
      category: lang === 'th' ? 'แผ่นเมทัลชีทเปลือย' : 'Bare Sheet',
      amount: 420000,
      share: '22%',
      fill: '#0ea5e9',
    },
    {
      category: lang === 'th' ? 'ครอบ & แฟลชชิ่ง' : 'Flashing & Trims',
      amount: 195000,
      share: '10%',
      fill: '#f59e0b',
    },
    {
      category: lang === 'th' ? 'สกรู & อุปกรณ์ติดตั้ง' : 'Screws & Fasteners',
      amount: 135000,
      share: '7%',
      fill: '#8b5cf6',
    },
  ];

  // Card theme helper
  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* KPI Top 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: MTD Sales & Run Rate */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden ${cardCls}`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {t.overviewKpi.mtdSales}
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-500">
              {formatTHB(mtdSalesTotal)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/40 text-xs flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {t.overviewKpi.workingDays}: {workingDaysElapsed}/{workingDaysInMonth}
            </span>
            <span className="text-sky-500 font-semibold">
              {Math.round((workingDaysElapsed / workingDaysInMonth) * 100)}% {lang === 'th' ? 'ของเดือน' : 'of Month'}
            </span>
          </div>
        </div>

        {/* Card 2: Projected Sales (Track A Adjusted Run Rate) */}
        <div className={`border rounded-2xl p-5 relative overflow-hidden ${cardCls}`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {t.overviewKpi.projectedSales}
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-sky-500">
              {formatTHB(forecast.base)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/40 text-xs flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {t.overviewKpi.salesPace}:
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                directionSignal === 'ahead'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : directionSignal === 'on_track'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {directionSignal === 'ahead'
                ? t.overviewKpi.aheadOfPace
                : directionSignal === 'on_track'
                ? t.overviewKpi.onTrack
                : t.overviewKpi.behindPace}
            </span>
          </div>
        </div>

        {/* Card 3: Overdue Accounts Receivable */}
        <div
          onClick={() => onNavigateToTab('ar')}
          className={`border rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:border-amber-500/50 transition ${cardCls}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {t.overviewKpi.overdueAr}
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-amber-500">
              {formatTHB(totalOverdueAmount)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/40 text-xs flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {lang === 'th' ? 'หนี้วิกฤต (>60 วัน):' : 'Critical (>60d):'}
            </span>
            <span className="font-semibold text-rose-400">
              {formatTHB(criticalOverdueAmount)}
            </span>
          </div>
        </div>

        {/* Card 4: Deposits & Stock Alerts */}
        <div
          onClick={() => onNavigateToTab('deposits')}
          className={`border rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:border-indigo-500/50 transition ${cardCls}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {t.overviewKpi.remainingDeposits}
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-indigo-500">
              {formatTHB(totalRemainingDeposits)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/40 text-xs flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {t.overviewKpi.stockAlerts}:
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToTab('stock');
              }}
              className="font-semibold text-rose-400 hover:underline cursor-pointer"
            >
              {outOfStockCount + lowStockCount} {t.items}
            </span>
          </div>
        </div>
      </div>

      {/* Track A: Mathematical Run Rate & Seasonality Card */}
      <div className={`border rounded-2xl p-6 ${cardCls}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-700/30">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {t.overviewKpi.runRateMath}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.overviewKpi.seasonalIndex}: <strong>x{seasonalFactor.toFixed(2)}</strong> (
              {lang === 'th'
                ? 'ปลายฝนเข้าฤดูเร่งมุงหลังคาไตรมาส 4'
                : 'Q4 peak construction demand ramp'}
              )
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className={`px-3 py-1.5 rounded-lg border ${subCardCls}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {lang === 'th' ? 'ยอดจริงเดือนก่อน:' : 'Last Month:'}{' '}
              </span>
              <strong className="text-slate-200 ml-1">{formatTHB(lastMonthSales)}</strong>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border ${subCardCls}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {lang === 'th' ? 'เป้าหมายเดือนนี้:' : 'Target:'}{' '}
              </span>
              <strong className="text-emerald-500 ml-1">
                {formatTHB(targetMonthlySales)}
              </strong>
            </div>
          </div>
        </div>

        {/* Progress Bar & Forecast Band Display */}
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.overviewKpi.targetProgress}: {targetProgressPct}% ({formatTHB(mtdSalesTotal)}{' '}
                / {formatTHB(targetMonthlySales)})
              </span>
              <span
                className={`font-semibold ${
                  directionSignal === 'ahead' ? 'text-emerald-500' : 'text-sky-500'
                }`}
              >
                {directionSignal === 'ahead'
                  ? `+${targetProgressPct - expectedPacePct}% ${lang === 'th' ? 'เร็วกว่าเวลา' : 'Ahead of pace'}`
                  : `${targetProgressPct - expectedPacePct}% ${lang === 'th' ? 'เทียบเวลา' : 'Vs pace'}`}
              </span>
            </div>

            <div
              className={`w-full h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(targetProgressPct, 100)}%` }}
              />
            </div>
          </div>

          {/* 3 Forecast Bands: Low / Base / High */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className={`p-3.5 rounded-xl border text-center ${subCardCls}`}>
              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th' ? 'ช่วงระมัดระวัง (Low Band -9%)' : 'Conservative Band (-9%)'}
              </div>
              <div className="text-lg font-bold text-amber-500 mt-1">
                {formatTHB(forecast.low)}
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th' ? 'หากฝนตกชุกหน้างานหยุด' : 'Heavy rain disruption'}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border-2 border-sky-500/60 text-center ${
                isDark ? 'bg-sky-950/20' : 'bg-sky-50'
              }`}
            >
              <div className="text-[11px] text-sky-500 font-semibold">
                {lang === 'th' ? 'คาดการณ์หลัก (Base Run Rate x Seasonal)' : 'Base Projected Forecast'}
              </div>
              <div className="text-xl font-black text-sky-500 mt-1">
                {formatTHB(forecast.base)}
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th'
                  ? `เทียบเป้า: ${(forecast.base / targetMonthlySales * 100).toFixed(1)}%`
                  : `Target ratio: ${(forecast.base / targetMonthlySales * 100).toFixed(1)}%`}
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-center ${subCardCls}`}>
              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th' ? 'ช่วงยอดสูง (High Band +9%)' : 'Optimistic Band (+9%)'}
              </div>
              <div className="text-lg font-bold text-emerald-500 mt-1">
                {formatTHB(forecast.high)}
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th' ? 'งานโรงงานเร่งส่งมอบ' : 'High project closure'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales Run-Rate Chart (2 Columns) */}
        <div className={`lg:col-span-2 border rounded-2xl p-6 ${cardCls}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-500" />
                {t.overviewKpi.dailySalesTrend}
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th'
                  ? 'เปรียบเทียบการชำระเงินสดหน้าร้าน vs วางบิลขายเชื่อโครงการ'
                  : 'Cash OTC purchases vs Commercial Credit Invoices'}
              </p>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {lang === 'th' ? 'กันยายน 2026' : 'September 2026'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="day"
                  stroke={chartColors.text}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={11}
                  tickFormatter={(val) => `฿${val / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltipBg,
                    borderColor: chartColors.tooltipBorder,
                    borderRadius: '0.75rem',
                    color: chartColors.text,
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  }}
                  formatter={(val: any) => [formatTHB(val), '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar
                  dataKey="cash"
                  name={lang === 'th' ? 'ขายสดหน้าร้าน' : 'Cash Sales'}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  stackId="sales"
                />
                <Bar
                  dataKey="credit"
                  name={lang === 'th' ? 'ขายเชื่อ (เครดิต)' : 'Credit Invoices'}
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                  stackId="sales"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Distribution (1 Column) */}
        <div className={`border rounded-2xl p-6 flex flex-col justify-between ${cardCls}`}>
          <div>
            <h4 className="text-base font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              {t.overviewKpi.categoryDistribution}
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'th'
                ? 'สัดส่วนรายได้ตามประเภทผลิตภัณฑ์หลัก'
                : 'Revenue distribution across product lines'}
            </p>

            <div className="mt-5 space-y-3.5">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.fill }}
                      />
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {cat.category}
                      </span>
                    </span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {formatTHB(cat.amount)} ({cat.share})
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: cat.share,
                        backgroundColor: cat.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-6 p-3 rounded-xl border text-xs ${subCardCls}`}>
            <span className="font-semibold text-emerald-500">
              {lang === 'th' ? 'ข้อสังเกต:' : 'Key Takeaway:'}
            </span>{' '}
            {lang === 'th'
              ? 'หลังคา PU โฟมสร้างสัดส่วนรายได้หลัก 61% ควรคุมสต็อกคอยล์เหล็กและน้ำยาเคมี PU ไม่ให้ขาด'
              : 'PU Foam roofing contributes 61% of turnover. Ensure coil and PU chemical stock remains healthy.'}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className={`border rounded-2xl p-6 ${cardCls}`}>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          {t.overviewKpi.quickActions}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateToTab('stock')}
            className={`p-3 rounded-xl border text-left hover:border-emerald-500 transition group ${subCardCls}`}
          >
            <div className="text-xs font-bold text-emerald-500 flex items-center justify-between">
              <span>{t.tabStock}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {outOfStockCount + lowStockCount} {t.stock.reorderAlert}
            </p>
          </button>

          <button
            onClick={() => onNavigateToTab('ar')}
            className={`p-3 rounded-xl border text-left hover:border-amber-500 transition group ${subCardCls}`}
          >
            <div className="text-xs font-bold text-amber-500 flex items-center justify-between">
              <span>{t.tabAr}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {overdueInvoices.length} {lang === 'th' ? 'ใบกำกับเกินกำหนด' : 'Overdue invoices'}
            </p>
          </button>

          <button
            onClick={() => onNavigateToTab('jobs')}
            className={`p-3 rounded-xl border text-left hover:border-sky-500 transition group ${subCardCls}`}
          >
            <div className="text-xs font-bold text-sky-500 flex items-center justify-between">
              <span>{t.tabJobs}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'th' ? 'เช็คคิวผลิต รีดลอน & ติด PU' : 'Check production queue'}
            </p>
          </button>

          <button
            onClick={() => onNavigateToTab('recommendations')}
            className={`p-3 rounded-xl border text-left hover:border-indigo-500 transition group ${subCardCls}`}
          >
            <div className="text-xs font-bold text-indigo-500 flex items-center justify-between">
              <span>{t.tabRecommendations}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'th' ? 'คำแนะนำอัจฉริยะ Track A/B' : 'Smart Action Engine'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
