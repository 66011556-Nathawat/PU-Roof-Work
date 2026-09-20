import React, { useState } from 'react';
import { Users, Search, Phone, Award, ChevronRight } from 'lucide-react';
import { CreditInvoice, CashSale } from '../types';
import { formatTHB } from '../utils/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface CustomersViewProps {
  creditInvoices: CreditInvoice[];
  cashSales: CashSale[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ creditInvoices, cashSales }) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');

  // Extract unique customer directory with statistics
  const customerMap = new Map<string, {
    name: string;
    type: string;
    totalOrders: number;
    totalSpent: number;
    outstanding: number;
    phone: string;
    tier: string;
  }>();

  // Aggregate credit invoices
  creditInvoices.forEach((inv) => {
    const existing = customerMap.get(inv.customerName) || {
      name: inv.customerName,
      type: inv.customerType || (lang === 'th' ? 'ผู้รับเหมา' : 'Contractor'),
      totalOrders: 0,
      totalSpent: 0,
      outstanding: 0,
      phone: '08X-XXX-XXXX',
      tier: 'VIP Contractor',
    };
    existing.totalOrders += 1;
    existing.totalSpent += inv.grandTotal;
    existing.outstanding += inv.outstandingBalance;
    customerMap.set(inv.customerName, existing);
  });

  // Aggregate cash sales
  cashSales.forEach((cs) => {
    const existing = customerMap.get(cs.customerName) || {
      name: cs.customerName,
      type: lang === 'th' ? 'ช่างทั่วไป' : 'Installer',
      totalOrders: 0,
      totalSpent: 0,
      outstanding: 0,
      phone: '08X-XXX-XXXX',
      tier: 'Standard',
    };
    existing.totalOrders += 1;
    existing.totalSpent += cs.totalAmount;
    customerMap.set(cs.customerName, existing);
  });

  const customerList = Array.from(customerMap.values()).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950/60 border-slate-800/80'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
            {lang === 'th' ? 'ระบบบริหารความสัมพันธ์คู่ค้า (CRM & Contractor Hub)' : 'CRM & Contractor Directory'}
          </span>
          <h3 className="text-xl font-bold mt-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-500" />
            {t.customers.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'th'
              ? 'ประวัติการซื้อ ยอดสะสม วงเงินเครดิต และประวัติการชำระเงินของช่างและผู้รับเหมาในเครือข่าย'
              : 'Purchase history, cumulative turnover, credit limits, and aging status for registered roofing installers'}
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'th' ? 'ค้นหาชื่อผู้รับเหมา, ลูกค้า...' : 'Search contractor, customer...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none transition ${
              isDark
                ? 'bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500'
                : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-sky-500'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customerList.map((customer, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-5 shadow-sm flex flex-col justify-between transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-slate-800 text-sky-300 border-slate-700'
                      : 'bg-slate-100 text-sky-700 border-slate-300'
                  }`}
                >
                  {customer.type}
                </span>
                <span className="text-[11px] text-amber-500 flex items-center gap-1 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{customer.totalSpent > 300000 ? 'Platinum Tier' : 'Gold Partner'}</span>
                </span>
              </div>

              <h4 className={`text-base font-bold mt-3 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {customer.name}
              </h4>
              <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{lang === 'th' ? 'ติดต่อประสานงานช่าง' : 'Direct contact'}</span>
              </p>

              <div className={`mt-4 p-3 rounded-lg border text-xs space-y-1.5 ${subCardCls}`}>
                <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{t.customers.totalOrders}:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {customer.totalOrders} {lang === 'th' ? 'ครั้ง' : 'orders'}
                  </span>
                </div>
                <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{t.customers.totalSpent}:</span>
                  <span className="font-semibold text-emerald-500">
                    {formatTHB(customer.totalSpent)}
                  </span>
                </div>
                <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{t.customers.outstandingAr}:</span>
                  <span
                    className={`font-semibold ${
                      customer.outstanding > 0 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {customer.outstanding > 0 ? formatTHB(customer.outstanding) : (lang === 'th' ? 'ไม่มีหนี้ค้าง' : 'No overdue balance')}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`mt-4 pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {lang === 'th' ? 'พร้อมรับเครดิตเทอม 30 วัน' : 'Eligible for 30d term'}
              </span>
              <button
                onClick={() =>
                  alert(`Profile details for ${customer.name}\nTotal spend: ${formatTHB(customer.totalSpent)}`)
                }
                className="text-xs text-sky-500 hover:text-sky-600 font-semibold flex items-center gap-1"
              >
                <span>{lang === 'th' ? 'ดูประวัติ' : 'View History'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
