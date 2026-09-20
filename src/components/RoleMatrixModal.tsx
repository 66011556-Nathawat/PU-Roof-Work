import React, { useState } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  XCircle,
  KeyRound,
  FileSpreadsheet,
  Trash2,
  Calculator,
  Truck,
  CreditCard,
  MessageSquare,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { UserRoleId } from '../types';
import { ROLE_DETAILS } from '../data/rolePermissions';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRoleId;
  onSelectRole: (role: UserRoleId) => void;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'matrix' | 'detail'>('matrix');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRoleId>(currentRole);

  if (!isOpen) return null;

  const roles: UserRoleId[] = ['ceo', 'admin', 'sales', 'warehouse', 'accounting'];

  const matrixRows = [
    {
      featureTh: 'รหัสผ่านยืนยันสิทธิ์ (Master PIN)',
      featureEn: 'Master PIN Verification',
      category: 'security',
      ceo: '🔑 1234',
      admin: '-',
      sales: '-',
      warehouse: '-',
      accounting: '-',
    },
    {
      featureTh: 'ภาพรวมบริษัท & กำไร (Executive P&L Forecast)',
      featureEn: 'Executive Overview & P&L',
      category: 'reports',
      ceo: 'yes',
      admin: 'yes',
      sales: 'partial',
      warehouse: 'no',
      accounting: 'partial',
    },
    {
      featureTh: 'นำเข้า 3 ไฟล์ Express Accounting CSV',
      featureEn: 'Import Express 3-CSV Files',
      category: 'data',
      ceo: 'yes',
      admin: 'yes',
      sales: 'no',
      warehouse: 'no',
      accounting: 'yes',
    },
    {
      featureTh: 'ล้างฐานข้อมูลระบบทั้งหมด (Clear Database)',
      featureEn: 'Clear Entire Database',
      category: 'data',
      ceo: 'yes',
      admin: 'partial',
      sales: 'no',
      warehouse: 'no',
      accounting: 'no',
    },
    {
      featureTh: 'รีเซ็ตข้อมูลตัวอย่าง (Reset Sample Data)',
      featureEn: 'Reset Sample Data',
      category: 'data',
      ceo: 'yes',
      admin: 'yes',
      sales: 'no',
      warehouse: 'no',
      accounting: 'no',
    },
    {
      featureTh: 'ออกข้อสั่งการ CEO & โน้ตถึง Admin (Directives)',
      featureEn: 'Issue CEO Directives & Notes to Admin',
      category: 'command',
      ceo: 'yes',
      admin: 'reply',
      sales: 'reply',
      warehouse: 'reply',
      accounting: 'reply',
    },
    {
      featureTh: 'ตอบกลับคอมเมนต์และอัปเดตงานที่มอบหมาย',
      featureEn: 'Reply Comments & Update Task Status',
      category: 'command',
      ceo: 'yes',
      admin: 'yes',
      sales: 'yes',
      warehouse: 'yes',
      accounting: 'yes',
    },
    {
      featureTh: 'สร้างใบเสนอราคา (Track B Quote Builder)',
      featureEn: 'Build Quotes with Margin Engine',
      category: 'sales',
      ceo: 'yes',
      admin: 'yes',
      sales: 'yes',
      warehouse: 'no',
      accounting: 'no',
    },
    {
      featureTh: 'อนุมัติราคาต่ำกว่าเกณฑ์กำไรขั้นต่ำ (Margin Floor < 18%)',
      featureEn: 'Override Margin Floor (< 18%)',
      category: 'sales',
      ceo: 'yes',
      admin: 'no',
      sales: 'no',
      warehouse: 'no',
      accounting: 'no',
    },
    {
      featureTh: 'ตรวจสอบสต็อก Days of Cover & Reorder Point',
      featureEn: 'Stock Health, Days of Cover, ROP',
      category: 'warehouse',
      ceo: 'yes',
      admin: 'yes',
      sales: 'partial',
      warehouse: 'yes',
      accounting: 'partial',
    },
    {
      featureTh: 'อัปเดตสถานะการผลิต & จัดส่ง (Delivery Queue)',
      featureEn: 'Update Production & Delivery Status',
      category: 'warehouse',
      ceo: 'yes',
      admin: 'yes',
      sales: 'no',
      warehouse: 'yes',
      accounting: 'no',
    },
    {
      featureTh: 'บริหารลูกหนี้ขายเชื่อ & ติดตามหนี้ AR Aging',
      featureEn: 'Credit Invoices & Overdue AR Follow-up',
      category: 'accounting',
      ceo: 'yes',
      admin: 'yes',
      sales: 'partial',
      warehouse: 'no',
      accounting: 'yes',
    },
    {
      featureTh: 'ตรวจสอบและตัดยอดใบรับมัดจำ (Deposit Receipts)',
      featureEn: 'Deposit Receipts & Invoice Reconciliation',
      category: 'accounting',
      ceo: 'yes',
      admin: 'yes',
      sales: 'partial',
      warehouse: 'no',
      accounting: 'yes',
    },
  ];

  const modalBgCls = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

  const renderBadge = (val: string) => {
    if (val === 'yes') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>{lang === 'th' ? 'ทำได้' : 'Allowed'}</span>
        </span>
      );
    }
    if (val === 'no') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
          <XCircle className="w-3 h-3" />
          <span>{lang === 'th' ? 'ทำไม่ได้' : 'Restricted'}</span>
        </span>
      );
    }
    if (val === 'partial') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <span>{lang === 'th' ? 'เฉพาะดูข้อมูล' : 'View-Only'}</span>
        </span>
      );
    }
    if (val === 'reply') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
          <span>{lang === 'th' ? 'ตอบกลับได้' : 'Can Reply'}</span>
        </span>
      );
    }
    return <span className="font-mono font-bold text-amber-500 text-xs">{val}</span>;
  };

  const currentDetail = ROLE_DETAILS[selectedRoleDetail];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`border rounded-2xl max-w-5xl w-full overflow-hidden my-4 max-h-[92vh] flex flex-col animate-fadeIn ${modalBgCls}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>{lang === 'th' ? 'ผังสิทธิ์บทบาทผู้ใช้งาน (Role Permission Matrix)' : 'Role Permission Matrix (RBAC)'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                  RBAC
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th'
                  ? 'ข้อกำหนดสิทธิ์การใช้งานของแต่ละบทบาท: CEO ทำได้ทุกอย่าง (รหัส 1234) และส่งโน้ตถึงแอดมิน บทบาทอื่นทำเฉพาะหน้าที่'
                  : 'Role access rules: CEO has 100% unrestricted access & notes to admin (PIN: 1234); other roles perform only their duties.'}
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

        {/* View Switcher Tabs */}
        <div
          className={`px-6 py-2.5 border-b flex items-center justify-between gap-4 flex-shrink-0 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              1. {lang === 'th' ? 'ตารางเปรียบเทียบสิทธิ์ (Full Matrix)' : 'Full Matrix'}
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'detail'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              2. {lang === 'th' ? 'รายละเอียดแยกรายบทบาท (Role Profiles)' : 'Role Profiles'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">{lang === 'th' ? 'บทบาทปัจจุบัน:' : 'Active Role:'}</span>
            <span className="font-bold text-amber-500 uppercase">
              {currentRole === 'ceo' ? '👑 CEO (1234)' : currentRole}
            </span>
          </div>
        </div>

        {/* Tab 1: Full Matrix */}
        {activeTab === 'matrix' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* CEO Highlight Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                isDark
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                  👑
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    {lang === 'th'
                      ? 'ผู้บริหารสูงสุด (CEO): สิทธิ์ควบคุม 100% ทุกระบบ พร้อมระบบข้อสั่งการถึงแอดมิน'
                      : 'CEO Master Authority: 100% Unrestricted Control & Directives to Admin'}
                  </h4>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {lang === 'th'
                      ? 'ปลดล็อกด้วยรหัสผ่านความปลอดภัย 1234 สามารถอนุมัติใบเสนอราคาต่ำกว่าเกณฑ์ และสั่งการทีมงานได้ทันที'
                      : 'Protected by Master PIN: 1234. Can override margin floor and issue directives to admin and staff.'}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-mono font-bold text-xs shadow-xs">
                  PIN: 1234
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div
              className={`border rounded-xl overflow-hidden ${
                isDark ? 'border-slate-800' : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
                      }`}
                    >
                      <th className="py-3 px-4 font-bold min-w-[240px]">
                        {lang === 'th' ? 'ฟังก์ชันการใช้งาน / สิทธิ์ระบบ' : 'Feature / Capability'}
                      </th>
                      <th className="py-3 px-3 font-bold text-center bg-amber-500/10 text-amber-500">
                        👑 CEO (1234)
                      </th>
                      <th className="py-3 px-3 font-bold text-center">🛡️ Admin</th>
                      <th className="py-3 px-3 font-bold text-center">💼 Sales</th>
                      <th className="py-3 px-3 font-bold text-center">📦 Warehouse</th>
                      <th className="py-3 px-3 font-bold text-center">💰 Accounting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {matrixRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition ${
                          isDark
                            ? idx % 2 === 0
                              ? 'bg-slate-900/30 hover:bg-slate-800/40'
                              : 'bg-slate-900/70 hover:bg-slate-800/40'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50'
                            : 'bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-medium">
                          {lang === 'th' ? row.featureTh : row.featureEn}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-amber-500/5">
                          {renderBadge(row.ceo)}
                        </td>
                        <td className="py-2.5 px-3 text-center">{renderBadge(row.admin)}</td>
                        <td className="py-2.5 px-3 text-center">{renderBadge(row.sales)}</td>
                        <td className="py-2.5 px-3 text-center">{renderBadge(row.warehouse)}</td>
                        <td className="py-2.5 px-3 text-center">{renderBadge(row.accounting)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Role Profiles */}
        {activeTab === 'detail' && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
            {/* Roles Sidebar */}
            <div
              className={`md:col-span-4 border-r p-4 space-y-2 overflow-y-auto ${
                isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === 'th' ? 'เลือกดูบทบาท' : 'Select Role'}
              </div>

              {roles.map((r) => {
                const detail = ROLE_DETAILS[r];
                const isSelected = selectedRoleDetail === r;
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleDetail(r)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md border-indigo-500'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">
                        {lang === 'th' ? detail.nameTh : detail.nameEn}
                      </span>
                      {detail.requiresPassword && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                          PIN: 1234
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 inline-block ${
                        isSelected ? 'text-indigo-100' : 'text-slate-400'
                      }`}
                    >
                      {lang === 'th' ? detail.badgeTh : detail.badgeEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Role Profile Details */}
            <div className="md:col-span-8 p-6 overflow-y-auto space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {lang === 'th' ? currentDetail.badgeTh : currentDetail.badgeEn}
                    </span>
                    {currentDetail.requiresPassword && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {lang === 'th' ? 'รหัสผ่าน: 1234' : 'PIN: 1234'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold">
                    {lang === 'th' ? currentDetail.nameTh : currentDetail.nameEn}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'th' ? currentDetail.descriptionTh : currentDetail.descriptionEn}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectRole(selectedRoleDetail);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>{lang === 'th' ? 'สลับเป็นบทบาทนี้' : 'Switch to this role'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* What this role CAN do */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <h5 className="text-xs font-bold text-emerald-500 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'th' ? 'สิ่งที่บทบาทนี้ "ทำได้" (Capabilities)' : 'What this role CAN do'}</span>
                </h5>
                <ul className="space-y-2 text-xs">
                  {(lang === 'th' ? currentDetail.canDoTh : currentDetail.canDoEn).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What this role CANNOT do */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-rose-950/10 border-rose-500/30' : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <h5 className="text-xs font-bold text-rose-400 flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4" />
                  <span>
                    {lang === 'th'
                      ? 'สิ่งที่บทบาทนี้ "ทำไม่ได้" (Restricted Boundaries)'
                      : 'What this role CANNOT do (Restricted)'}
                  </span>
                </h5>
                <ul className="space-y-2 text-xs">
                  {(lang === 'th' ? currentDetail.cannotDoTh : currentDetail.cannotDoEn).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between text-xs flex-shrink-0 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>
              {lang === 'th'
                ? 'ระบบบังคับใช้สิทธิ์ (RBAC) เป็นไปตามเอกสารสเปคใน GitHub Repository (rbac.md)'
                : 'RBAC rules strictly enforced according to rbac.md specification'}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-medium transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
