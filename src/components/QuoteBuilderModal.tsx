import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Printer,
  ShieldCheck,
  Lock,
  Plus,
} from 'lucide-react';
import { StockItem, QuoteLine, UserRoleId } from '../types';
import { formatTHB, checkQuoteGuardrails } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface QuoteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  currentRole?: UserRoleId;
  isCeoUnlocked?: boolean;
  onRequestCeoUnlock?: () => void;
}

export const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  currentRole = 'ceo',
  isCeoUnlocked = true,
  onRequestCeoUnlock,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const [customerName, setCustomerName] = useState('บจก. ธนทรัพย์ พัฒนาอสังหาฯ');
  const [projectName, setProjectName] = useState('โครงการโกดังสินค้า คลองหลวง');
  const [labourHours, setLabourHours] = useState<number>(18);
  const [technicianCostPerHour, setTechnicianCostPerHour] = useState<number>(250);
  const [overheadPerHour, setOverheadPerHour] = useState<number>(100);
  const [utilisationRate, setUtilisationRate] = useState<number>(0.7); // 70% utilisation (Slide 31)
  const [discountAmount, setDiscountAmount] = useState<number>(1000);
  const [ceoOverrideApproved, setCeoOverrideApproved] = useState(false);

  // Initial quote lines
  const [lines, setLines] = useState<QuoteLine[]>([
    {
      sku: 'PU-760-035-BL',
      name: 'หลังคาเมทัลชีท ลอน 760 บุพียูโฟม 1 นิ้ว (สีน้ำเงิน)',
      qty: 250,
      unit: 'เมตร',
      unitCost: 215,
      markupPercent: 32,
      unitPrice: 285,
      totalPrice: 250 * 285,
    },
    {
      sku: 'FL-COR-035-BL',
      name: 'ครอบจั่ว เมทัลชีท 0.35 มม. ยาว 3.10 ม.',
      qty: 20,
      unit: 'ท่อน',
      unitCost: 135,
      markupPercent: 44,
      unitPrice: 195,
      totalPrice: 20 * 195,
    },
    {
      sku: 'SCR-HEX-048',
      name: 'สกรูปลายสว่านยึดแปเหล็ก 12x48 มม. (กล่อง 500 ตัว)',
      qty: 4,
      unit: 'กล่อง',
      unitCost: 290,
      markupPercent: 45,
      unitPrice: 420,
      totalPrice: 4 * 420,
    },
  ]);

  if (!isOpen) return null;

  const isCeo = currentRole === 'ceo' && isCeoUnlocked;

  // Track B Calculations: Labour Rate = (Technician Cost + Overhead) / Utilisation
  const effectiveHourlyLabourRate =
    utilisationRate > 0 ? (technicianCostPerHour + overheadPerHour) / utilisationRate : 0;
  const labourPriceTotal = labourHours * effectiveHourlyLabourRate;
  const labourCostTotal = labourHours * (technicianCostPerHour + overheadPerHour);

  // Material Totals
  const partsSellingTotal = lines.reduce((sum, line) => sum + line.totalPrice, 0);
  const partsCostTotal = lines.reduce((sum, line) => sum + line.unitCost * line.qty, 0);

  // Aggregated Values
  const totalSellingBeforeDiscount = partsSellingTotal + labourPriceTotal;
  const totalCost = partsCostTotal + labourCostTotal;
  const netSellingPrice = Math.max(0, totalSellingBeforeDiscount - discountAmount);
  const grossProfit = netSellingPrice - totalCost;
  const grossMarginPercent =
    netSellingPrice > 0 ? Math.round((grossProfit / netSellingPrice) * 100) : 0;

  // Track B Guardrails check: Floor 20%, Target 25%, Ceiling 35%
  const guardrail = checkQuoteGuardrails(totalCost, netSellingPrice);

  const vatAmount = netSellingPrice * 0.07;
  const grandTotal = netSellingPrice + vatAmount;

  const handleUpdateMarkup = (index: number, newMarkup: number) => {
    const updated = [...lines];
    const line = updated[index];
    line.markupPercent = newMarkup;
    line.unitPrice = Math.round(line.unitCost * (1 + newMarkup / 100));
    line.totalPrice = line.unitPrice * line.qty;
    setLines(updated);
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    const updated = [...lines];
    const line = updated[index];
    line.qty = Math.max(1, newQty);
    line.totalPrice = line.unitPrice * line.qty;
    setLines(updated);
  };

  const handleAddStockItem = (item: StockItem) => {
    const newLine: QuoteLine = {
      sku: item.sku,
      name: item.name,
      qty: 10,
      unit: item.unit,
      unitCost: item.cost,
      markupPercent: Math.round(item.markupBand * 100) || 30,
      unitPrice: item.sellingPrice || Math.round(item.cost * 1.3),
      totalPrice: (item.sellingPrice || Math.round(item.cost * 1.3)) * 10,
    };
    setLines([...lines, newLine]);
  };

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const modalBgCls = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const headerFooterBg = isDark
    ? 'bg-slate-950 border-slate-800'
    : 'bg-slate-50 border-slate-200';
  const subCardBg = isDark
    ? 'bg-slate-950/60 border-slate-800'
    : 'bg-slate-50 border-slate-200';
  const inputBg = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-300 text-slate-900';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-2xl max-w-4xl w-full overflow-hidden my-8 animate-fadeIn ${modalBgCls}`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${headerFooterBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  {lang === 'th'
                    ? 'ระบบคำนวณราคา & ออกใบเสนอราคา (Track B Quote Builder)'
                    : 'Commercial Quote Builder (Track B Formulas)'}
                </h3>
                {isCeo && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    👑 CEO Override Enabled (1234)
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th'
                  ? 'คำนวณต้นทุนสินค้า + ค่าแรงพร้อมตัวคูณการใช้งาน (Utilisation) และการตรวจจับขอบเขตกำไร'
                  : 'Labour rate = (technician cost + overhead) ÷ utilisation (70%) with gross margin floor guardrail'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Project Info */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border ${subCardBg}`}>
            <div>
              <label className={`text-xs font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'th' ? 'ชื่อลูกค้า / บริษัท' : 'Customer / Company'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full text-xs rounded-lg px-3 py-2 border ${inputBg}`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'th' ? 'ชื่อโครงการ / หน้างาน' : 'Project / Site'}
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`w-full text-xs rounded-lg px-3 py-2 border ${inputBg}`}
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span>{lang === 'th' ? 'รายการสินค้า (Parts & Materials)' : 'Line Items'}</span>
                <span className="text-xs font-normal text-slate-400">({lines.length} {t.items})</span>
              </h4>
            </div>

            <div className={`border rounded-xl overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b ${isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  <tr>
                    <th className="py-2.5 px-3">SKU / {lang === 'th' ? 'ชื่อสินค้า' : 'Product Name'}</th>
                    <th className="py-2.5 px-2 text-right">{t.quantity}</th>
                    <th className="py-2.5 px-2 text-right">{lang === 'th' ? 'ต้นทุน/หน่วย' : 'Cost/Unit'}</th>
                    <th className="py-2.5 px-2 text-center">{lang === 'th' ? 'มาร์กอัป %' : 'Markup %'}</th>
                    <th className="py-2.5 px-2 text-right">{lang === 'th' ? 'ราคาขาย/หน่วย' : 'Price/Unit'}</th>
                    <th className="py-2.5 px-3 text-right">{t.totalAmount}</th>
                    <th className="py-2.5 px-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {lines.map((line, idx) => (
                    <tr key={idx} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                      <td className="py-2.5 px-3 font-medium">
                        <div className="font-semibold">{line.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{line.sku}</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">
                        <input
                          type="number"
                          min="1"
                          value={line.qty}
                          onChange={(e) => handleUpdateQty(idx, parseInt(e.target.value) || 1)}
                          className={`w-16 rounded px-1.5 py-1 text-right text-xs ${inputBg}`}
                        />
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-400">
                        {formatTHB(line.unitCost)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            value={line.markupPercent}
                            onChange={(e) => handleUpdateMarkup(idx, parseFloat(e.target.value) || 0)}
                            className={`w-14 rounded px-1 py-1 text-center text-xs font-semibold ${inputBg}`}
                          />
                          <span className="text-slate-400">%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-semibold">
                        {formatTHB(line.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-500">
                        {formatTHB(line.totalPrice)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveLine(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="ลบรายการ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Add from Catalog */}
            <div className="pt-1">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                {lang === 'th' ? '+ เพิ่มสินค้าด่วนจากคลัง:' : '+ Quick Add Item:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {stockItems.slice(0, 4).map((s) => (
                  <button
                    key={s.sku}
                    type="button"
                    onClick={() => handleAddStockItem(s)}
                    className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                      isDark
                        ? 'bg-slate-950/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                        : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-amber-500" />
                    <span>{s.name.substring(0, 24)}...</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Track B Labour Rate Formulas Section (Slide 31) */}
          <div className={`p-4 rounded-xl border space-y-3 ${subCardBg}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>{lang === 'th' ? 'สูตรคำนวณค่าแรง & อัตราการใช้งาน (Track B Labour Formula)' : 'Labour Rate & Utilisation Formula'}</span>
            </h4>
            <div className="text-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'th' ? 'ชั่วโมงงาน (Hours)' : 'Labour Hours'}</label>
                <input
                  type="number"
                  value={labourHours}
                  onChange={(e) => setLabourHours(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded px-2.5 py-1.5 text-xs font-mono ${inputBg}`}
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'th' ? 'ค่าช่าง/ชม. (฿)' : 'Tech Cost/Hr'}</label>
                <input
                  type="number"
                  value={technicianCostPerHour}
                  onChange={(e) => setTechnicianCostPerHour(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded px-2.5 py-1.5 text-xs font-mono ${inputBg}`}
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'th' ? 'ค่าโสหุ้ย/ชม. (฿)' : 'Overhead/Hr'}</label>
                <input
                  type="number"
                  value={overheadPerHour}
                  onChange={(e) => setOverheadPerHour(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded px-2.5 py-1.5 text-xs font-mono ${inputBg}`}
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'th' ? 'Utilisation (0.7 = 70%)' : 'Utilisation Rate'}</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={utilisationRate}
                  onChange={(e) => setUtilisationRate(parseFloat(e.target.value) || 0.7)}
                  className={`w-full rounded px-2.5 py-1.5 text-xs font-mono ${inputBg}`}
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
              <span>สูตร: (ค่าช่าง {technicianCostPerHour} + โสหุ้ย {overheadPerHour}) ÷ {utilisationRate} = <strong>{Math.round(effectiveHourlyLabourRate)} ฿/ชม.</strong></span>
              <span className="font-semibold text-emerald-400">{lang === 'th' ? 'รวมค่าแรงคิดลูกค้า:' : 'Labour Selling Total:'} {formatTHB(labourPriceTotal)}</span>
            </div>
          </div>

          {/* Profit Guardrails Check (Floor 20%, Target 25%, Ceiling 35%) */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              guardrail.status === 'below_floor'
                ? ceoOverrideApproved
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                  : isDark
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
                : guardrail.status === 'above_ceiling'
                ? isDark
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
                : isDark
                ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {guardrail.status === 'below_floor' ? (
                ceoOverrideApproved ? (
                  <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-500 flex-shrink-0" />
                )
              ) : guardrail.status === 'above_ceiling' ? (
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {guardrail.status === 'below_floor'
                    ? ceoOverrideApproved
                      ? lang === 'th'
                        ? '👑 ได้รับการอนุมัติข้อยกเว้นจาก CEO แล้ว (CEO Margin Floor Override)'
                        : '👑 Approved via CEO Margin Override'
                      : lang === 'th'
                      ? '⚠️ แจ้งเตือน: ราคาต่ำกว่าเกณฑ์ขั้นต่ำ (Floor Guardrail Triggered)'
                      : '⚠️ Warning: Price below profit floor'
                    : guardrail.status === 'above_ceiling'
                    ? lang === 'th'
                      ? '⚠️ แจ้งเตือน: ราคาสูงกว่าเพดานตลาด (Ceiling Guardrail)'
                      : '⚠️ Notice: Price above ceiling'
                    : lang === 'th'
                    ? '✓ ผ่านเกณฑ์ควบคุมราคา (Price Guardrail Passed)'
                    : '✓ Profit Guardrail Passed'}
                </div>
                <div className="text-xs mt-0.5 opacity-90">
                  {guardrail.warningMessage ||
                    (lang === 'th'
                      ? `อัตรากำไรขั้นต้น (Gross Margin): ${grossMarginPercent}% สูงกว่าเกณฑ์ขั้นต่ำ 20%`
                      : `Gross margin: ${grossMarginPercent}% exceeds 20% floor minimum`)}
                </div>
              </div>
            </div>

            {/* CEO Override Button for Below Floor */}
            {guardrail.status === 'below_floor' && (
              <div className="flex items-center gap-2">
                {isCeo ? (
                  <button
                    type="button"
                    onClick={() => setCeoOverrideApproved(!ceoOverrideApproved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      ceoOverrideApproved
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {ceoOverrideApproved
                        ? lang === 'th'
                          ? 'อนุมัติแล้ว (CEO)'
                          : 'Override Active'
                        : lang === 'th'
                        ? '👑 CEO อนุมัติราคาพิเศษ (1234)'
                        : '👑 CEO Authorize Override'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onRequestCeoUnlock}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-slate-700 transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'ขออนุมัติจาก CEO (รหัส 1234)' : 'Request CEO Sign-off (1234)'}</span>
                  </button>
                )}
              </div>
            )}

            <div className="text-right flex-shrink-0 font-mono text-xs">
              <div>{lang === 'th' ? 'เกณฑ์ขั้นต่ำ (Floor):' : 'Floor:'} {formatTHB(guardrail.floor)}</div>
            </div>
          </div>

          {/* Grand Totals Summary */}
          <div className={`p-4 rounded-xl border space-y-2 text-xs ${subCardBg}`}>
            <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>{lang === 'th' ? 'ต้นทุนรวมสินค้าและแรงงาน (Total Cost):' : 'Total Direct Cost:'}</span>
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{formatTHB(totalCost)}</span>
            </div>
            <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>{lang === 'th' ? 'ราคาสินค้ารวม (Parts Total):' : 'Parts Subtotal:'}</span>
              <span>{formatTHB(partsSellingTotal)}</span>
            </div>
            <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>{lang === 'th' ? 'ค่าแรงและติดตั้ง (Labour Total):' : 'Labour Subtotal:'}</span>
              <span>{formatTHB(labourPriceTotal)}</span>
            </div>
            <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>{lang === 'th' ? 'ส่วนลดการค้า:' : 'Commercial Discount:'}</span>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className={`w-24 rounded px-2 py-0.5 text-right text-xs ${inputBg}`}
              />
            </div>
            <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>{lang === 'th' ? 'ภาษีมูลค่าเพิ่ม (VAT 7%):' : 'VAT (7%):'}</span>
              <span>{formatTHB(vatAmount)}</span>
            </div>
            <div className={`pt-2 border-t flex justify-between text-sm font-bold ${isDark ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'}`}>
              <span>{lang === 'th' ? 'ยอดสุทธิรวมภาษี (Grand Total):' : 'Grand Total (Inc. VAT):'}</span>
              <span className="text-lg text-emerald-500 font-mono">{formatTHB(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${headerFooterBg}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              isDark
                ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                : 'text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300'
            }`}
          >
            {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'พิมพ์ใบเสนอราคา' : 'Print Quote'}</span>
            </button>
            <button
              onClick={() => {
                alert(
                  lang === 'th'
                    ? `✓ บันทึกใบเสนอราคาเลขที่ QT6709-${Math.floor(1000 + Math.random() * 9000)} ยอดรวม ${formatTHB(grandTotal)} เรียบร้อยแล้ว`
                    : `✓ Quote saved: QT6709-${Math.floor(1000 + Math.random() * 9000)} Total: ${formatTHB(grandTotal)}`
                );
                onClose();
              }}
              className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-sm transition"
            >
              {lang === 'th' ? 'บันทึกใบเสนอราคา (Save Quote)' : 'Save Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
