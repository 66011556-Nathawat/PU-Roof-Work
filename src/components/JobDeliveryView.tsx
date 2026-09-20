import React, { useState } from 'react';
import { Truck, MapPin, Phone, UserCheck } from 'lucide-react';
import { DeliveryJob } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface JobDeliveryViewProps {
  jobs: DeliveryJob[];
  onUpdateJobStatus: (id: string, newStatus: DeliveryJob['status']) => void;
}

export const JobDeliveryView: React.FC<JobDeliveryViewProps> = ({ jobs, onUpdateJobStatus }) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredJobs = jobs.filter((j) => (filterStatus === 'all' ? true : j.status === filterStatus));

  const countByStatus = {
    รอรีดลอน: jobs.filter((j) => j.status === 'รอรีดลอน').length,
    กำลังติดPU: jobs.filter((j) => j.status === 'กำลังติด PU').length,
    พร้อมจัดส่ง: jobs.filter((j) => j.status === 'พร้อมจัดส่ง').length,
    จัดส่งเรียบร้อย: jobs.filter((j) => j.status === 'จัดส่งเรียบร้อย').length,
  };

  const cardCls = isDark
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const subCardCls = isDark
    ? 'bg-slate-950 border-slate-800'
    : 'bg-slate-50 border-slate-200';

  const pipelineCards = [
    {
      id: 'รอรีดลอน',
      label: t.jobs.statusRollForming,
      count: countByStatus['รอรีดลอน'],
      color: 'text-amber-500',
      border: isDark ? 'border-amber-500/40' : 'border-amber-200',
      bg: isDark ? 'bg-amber-950/30' : 'bg-amber-50',
    },
    {
      id: 'กำลังติด PU',
      label: t.jobs.statusApplyingPu,
      count: countByStatus['กำลังติดPU'],
      color: 'text-sky-500',
      border: isDark ? 'border-sky-500/40' : 'border-sky-200',
      bg: isDark ? 'bg-sky-950/30' : 'bg-sky-50',
    },
    {
      id: 'พร้อมจัดส่ง',
      label: t.jobs.statusReadyToShip,
      count: countByStatus['พร้อมจัดส่ง'],
      color: 'text-emerald-500',
      border: isDark ? 'border-emerald-500/40' : 'border-emerald-200',
      bg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50',
    },
    {
      id: 'จัดส่งเรียบร้อย',
      label: t.jobs.statusDelivered,
      count: countByStatus['จัดส่งเรียบร้อย'],
      color: isDark ? 'text-slate-400' : 'text-slate-500',
      border: isDark ? 'border-slate-700' : 'border-slate-200',
      bg: isDark ? 'bg-slate-900/60' : 'bg-slate-50',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
            {lang === 'th' ? 'แผนกผลิตและโลจิสติกส์ PU Roof Works' : 'PU Roof Works Logistics & Shop Floor'}
          </span>
          <h3 className="text-xl font-bold mt-2 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-500" />
            {t.jobs.title}
          </h3>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'th'
              ? 'ควบคุมกระบวนการรีดลอนเมทัลชีท การฉีดโฟม PU และคิวรถจัดส่งสินค้าถึงหน้างานก่อสร้าง'
              : 'Monitor roll forming, polyurethane lamination, and site dispatch schedules in real time'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${subCardCls}`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {lang === 'th' ? 'คิวงานรอส่งมอบ:' : 'Pending queues:'}{' '}
            </span>
            <span className="font-bold text-amber-500">{jobs.length} {lang === 'th' ? 'คัน' : 'trucks'}</span>
          </div>
        </div>
      </div>

      {/* Status Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {pipelineCards.map((st) => (
          <button
            key={st.id}
            onClick={() => setFilterStatus(filterStatus === st.id ? 'all' : st.id)}
            className={`p-4 rounded-xl border text-left transition ${
              filterStatus === st.id
                ? 'ring-2 ring-sky-500 ' + st.bg
                : cardCls + ' ' + st.border
            }`}
          >
            <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {st.label}
            </div>
            <div className={`text-2xl font-black mt-1 ${st.color}`}>{st.count}</div>
          </button>
        ))}
      </div>

      {/* Jobs Table & Timeline */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`border rounded-xl p-5 shadow-sm transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-sky-500">{job.jobNo}</span>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {job.customerName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.status}:
                </span>
                <select
                  value={job.status}
                  onChange={(e) => onUpdateJobStatus(job.id, e.target.value as any)}
                  className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200'
                      : 'bg-slate-50 border border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="รอรีดลอน">{t.jobs.statusRollForming}</option>
                  <option value="กำลังติด PU">{t.jobs.statusApplyingPu}</option>
                  <option value="พร้อมจัดส่ง">{t.jobs.statusReadyToShip}</option>
                  <option value="จัดส่งเรียบร้อย">{t.jobs.statusDelivered}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
              <div className="space-y-1">
                <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {lang === 'th' ? 'รายการผลิต:' : 'Production Details:'}
                </div>
                <div className={`font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {job.itemsSummary}
                </div>
                <div className="text-emerald-500 font-semibold mt-1">
                  {lang === 'th' ? 'ความยาวรวม:' : 'Total length:'} {job.totalLengthMeters.toLocaleString()} {lang === 'th' ? 'เมตร' : 'm'}
                </div>
              </div>

              <div className="space-y-1">
                <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'th' ? 'สถานที่จัดส่ง:' : 'Destination Site:'}</span>
                </div>
                <div className={isDark ? 'text-slate-200' : 'text-slate-800'}>{job.location}</div>
              </div>

              <div className="space-y-1">
                <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>{lang === 'th' ? 'ผู้รับมอบ / ช่างติดตั้ง:' : 'Site Contact / Foreman:'}</span>
                </div>
                <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {job.installerName}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Phone className="w-3 h-3 text-emerald-500" />
                  <span>{job.phone}</span>
                </div>
                <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'th' ? 'กำหนดส่ง:' : 'Schedule:'}{' '}
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {job.scheduledDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
