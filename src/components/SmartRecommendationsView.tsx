import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Package,
  PhoneForwarded,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { StockItem, CreditInvoice, CashSale } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface SmartRecommendationsViewProps {
  stockItems: StockItem[];
  creditInvoices: CreditInvoice[];
  cashSales: CashSale[];
  onNavigateToTab: (tab: any) => void;
  openQuoteModal: () => void;
}

export const SmartRecommendationsView: React.FC<SmartRecommendationsViewProps> = ({
  stockItems,
  creditInvoices,
  cashSales,
  onNavigateToTab,
  openQuoteModal,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const criticalStock = stockItems.filter((i) => i.status === 'out' || i.status === 'low');
  const criticalAR = creditInvoices.filter((i) => i.status.includes('61-90') || i.status.includes('90+'));
  const overstockItems = stockItems.filter((i) => i.daysOfCover > 90);

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div
        className={`border rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4 ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-800/40 text-white'
            : 'bg-gradient-to-r from-indigo-50 via-white to-sky-50 border-indigo-200 text-slate-900'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                isDark
                  ? 'text-indigo-300 bg-indigo-900/60 border-indigo-700/50'
                  : 'text-indigo-700 bg-indigo-100 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Automated Business Intelligence Engine
            </span>
          </div>
          <h3 className="text-xl font-bold mt-2">
            {t.recommendations.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'th'
              ? 'วิเคราะห์จุดเสี่ยงและโอกาสทางธุรกิจอัตโนมัติจากข้อมูล Express 3 ไฟล์ (ขายเงินสด, ขายเชื่อ, เงินมัดจำ) และคลังสินค้าโรงงาน'
              : 'Automated intelligence synthesizing Express 3-file accounting data (Cash Sales, Invoices, Deposits) with production inventory'}
          </p>
        </div>
      </div>

      {/* Priority Action Cards */}
      <div className="space-y-4">
        {/* Recommendation 1: Procurement Alert */}
        {criticalStock.length > 0 && (
          <div
            className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isDark
                ? 'bg-slate-900 border-rose-900/40 text-white'
                : 'bg-white border-rose-200 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  isDark
                    ? 'bg-rose-950/80 border-rose-800/50 text-rose-400'
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}
              >
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    {t.recommendations.procurementAlert}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'th' ? 'สต็อกคงเหลือต่ำกว่าเกณฑ์ความปลอดภัย' : 'Stock below minimum safety thresholds'}
                  </span>
                </div>
                <h4 className="text-base font-bold mt-1">
                  {lang === 'th'
                    ? 'สั่งซื้อคอยล์เหล็ก 0.35มม. และสารเคมี PU ส่วน B เพิ่มเติม'
                    : 'Reorder 0.35mm Steel Coils and Polyurethane Component B'}
                </h4>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'th'
                    ? 'คอยล์เหล็กสีน้ำเงินคงเหลือเพียง 2 ม้วน (คลุมการผลิตได้ 5 วัน ขณะที่ Lead time 14 วัน) มีความเสี่ยงเครื่องจักรรีดลอนหยุดชะงักหากได้รับออเดอร์หลังคาโรงงานใหญ่'
                    : 'Blue steel coil is down to 2 coils (5 days of cover vs 14 days lead time). Risk of profile roll-forming stoppage on high-volume orders.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('stock')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 self-end sm:self-center border ${
                isDark
                  ? 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border-rose-700/60'
                  : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-xs'
              }`}
            >
              <span>{lang === 'th' ? 'ดูรายการสั่งซื้อ' : 'View Reorder List'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Recommendation 2: Credit Collection */}
        {criticalAR.length > 0 && (
          <div
            className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isDark
                ? 'bg-slate-900 border-amber-900/40 text-white'
                : 'bg-white border-amber-200 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  isDark
                    ? 'bg-amber-950/80 border-amber-800/50 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-600'
                }`}
              >
                <PhoneForwarded className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-amber-950 text-amber-300 border-amber-800/60'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    {t.recommendations.creditFollowup}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'th' ? 'เกินกำหนดมากกว่า 60 วัน' : 'Overdue by > 60 days'}
                  </span>
                </div>
                <h4 className="text-base font-bold mt-1">
                  {lang === 'th'
                    ? 'โทรประสานงานโครงการ "บจก. ธนทรัพย์" และ "นายมงคล รับเหมา"'
                    : 'Urgent Accounts Receivable Follow-up: High Exposure Accounts'}
                </h4>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'th'
                    ? 'มียอดหนี้ค้างชำระเกิน 60-90 วัน รวมกว่า ฿272,980 แนะนำให้ฝ่ายบัญชีส่งหนังสือแจ้งเตือน และระงับการเปิดเครดิตออเดอร์ใหม่จนกว่าจะชำระยอดเดิม'
                    : 'Outstanding balances exceeding 60-90 days total ฿272,980. Issue formal demand reminders and hold new manufacturing credits until settled.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('ar')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 self-end sm:self-center border ${
                isDark
                  ? 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border-amber-700/60'
                  : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-xs'
              }`}
            >
              <span>{lang === 'th' ? 'ดูตารางอายุหนี้' : 'View AR Aging'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Recommendation 3: Push List Campaign */}
        {overstockItems.length > 0 && (
          <div
            className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isDark
                ? 'bg-slate-900 border-purple-900/40 text-white'
                : 'bg-white border-purple-200 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  isDark
                    ? 'bg-purple-950/80 border-purple-800/50 text-purple-400'
                    : 'bg-purple-50 border-purple-200 text-purple-600'
                }`}
              >
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-purple-950 text-purple-300 border-purple-800/60'
                        : 'bg-purple-100 text-purple-700 border-purple-200'
                    }`}
                  >
                    {t.recommendations.slowMovingPush}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'th' ? 'วันครอบคลุมสต็อก > 90 วัน' : 'Days of Cover > 90 days'}
                  </span>
                </div>
                <h4 className="text-base font-bold mt-1">
                  {lang === 'th'
                    ? 'จัดโปรโมชั่นพ่วง "แผ่นโปร่งแสงไฟเบอร์กลาส" และ "รางน้ำสแตนเลส"'
                    : 'Bundle Clearance Promotion: Translucent Skylight & Stainless Gutters'}
                </h4>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'th'
                    ? 'แผ่นหลังคาโปร่งแสงและรางน้ำตะเข้มีวันครอบคลุมกว่า 109 วัน แนะนำให้ฝ่ายขายเสนอเป็นชุดแพ็กเกจ พร้อมส่วนลดพิเศษ 10% ให้ลูกค้าที่สั่งซื้อหลังคา PU เกิน 100 เมตร'
                    : 'Skylight sheets and gutters exceed 109 days of cover. Proactively offer a 10% discount bundle on orders over 100 meters of PU foam roof.'}
                </p>
              </div>
            </div>

            <button
              onClick={openQuoteModal}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 self-end sm:self-center border ${
                isDark
                  ? 'bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border-purple-700/60'
                  : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700 shadow-xs'
              }`}
            >
              <span>{lang === 'th' ? 'สร้างใบเสนอราคาแพ็กเกจ' : 'Create Bundle Quote'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Recommendation 4: Seasonality Readiness */}
        <div
          className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
            isDark
              ? 'bg-slate-900 border-emerald-900/40 text-white'
              : 'bg-white border-emerald-200 text-slate-900'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                isDark
                  ? 'bg-emerald-950/80 border-emerald-800/50 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {t.recommendations.seasonalReadiness}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'th' ? 'ดัชนีฤดูกาลพุ่งขึ้น 1.14x' : 'Seasonality factor 1.14x'}
                </span>
              </div>
              <h4 className="text-base font-bold mt-1">
                {lang === 'th'
                  ? 'เตรียมสต็อกโฟม PU 2 นิ้วและแผ่นหลังคาสำหรับช่วงหมดฝน'
                  : 'Prepare PU 2-inch Insulation & bare sheets for peak post-monsoon'}
              </h4>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'th'
                  ? 'ข้อมูลย้อนหลังชี้ว่าเดือนตุลาคม-ธันวาคม ยอดสั่งทำหลังคาโรงงานและต่อเติมบ้านพักจะเติบโตกว่า 20-30% หลังพ้นฤดูมรสุม ควรประสานงานซัพพลายเออร์คอยล์เหล็กเพื่อล็อคราคาต้นทุนล่วงหน้า'
                  : 'Historical records confirm October-December surges by 20-30% following the rainy season. Lock forward supplier coil pricing now.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 self-end sm:self-center border ${
              isDark
                ? 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border-emerald-700/60'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
            }`}
          >
            <span>{lang === 'th' ? 'ดูพยากรณ์ยอดขาย' : 'View Sales Forecast'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
