import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Users,
  CreditCard,
  Receipt,
  Sparkles,
  FileInput,
  Calculator,
  FileText,
  Building2,
  ChevronRight,
  MessageSquare,
  Shield,
  Lock,
} from 'lucide-react';
import { ActiveTab, UserRoleId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ROLE_DETAILS } from '../data/rolePermissions';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openQuoteModal: () => void;
  openDocsModal: () => void;
  openCeoDirectivesModal: () => void;
  openRoleMatrixModal: () => void;
  pendingJobsCount: number;
  cashSalesCount: number;
  invoicesCount: number;
  depositsCount: number;
  currentRole: UserRoleId;
  pendingDirectivesCount: number;
  isCeoUnlocked: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openQuoteModal,
  openDocsModal,
  openCeoDirectivesModal,
  openRoleMatrixModal,
  pendingJobsCount,
  currentRole,
  pendingDirectivesCount,
  isCeoUnlocked,
}) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  const activeRoleDetail = ROLE_DETAILS[currentRole];

  const menuItems = [
    {
      id: 'overview' as ActiveTab,
      label: t.tabOverview,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'stock' as ActiveTab,
      label: t.tabStock,
      icon: Boxes,
      badge: t.badgeAlert,
      badgeColor: isDark
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        : 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    {
      id: 'jobs' as ActiveTab,
      label: t.tabJobs,
      icon: Truck,
      badge: pendingJobsCount.toString(),
      badgeColor: 'bg-rose-500 text-white font-semibold',
    },
    {
      id: 'customers' as ActiveTab,
      label: t.tabCustomers,
      icon: Users,
      badge: null,
    },
    {
      id: 'ar' as ActiveTab,
      label: t.tabAr,
      icon: CreditCard,
      badge: null,
    },
    {
      id: 'deposits' as ActiveTab,
      label: t.tabDeposits,
      icon: Receipt,
      badge: null,
    },
    {
      id: 'recommendations' as ActiveTab,
      label: t.tabRecommendations,
      icon: Sparkles,
      badge: t.badgeAi,
      badgeColor: isDark
        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
        : 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    },
    {
      id: 'import' as ActiveTab,
      label: t.tabImport,
      icon: FileInput,
      badge: t.badge3Csv,
      badgeColor: isDark
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    },
  ];

  return (
    <aside
      className={`w-72 border-r flex flex-col flex-shrink-0 min-h-screen select-none transition-colors ${
        isDark
          ? 'bg-[#080d19] border-slate-800 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`p-4 border-b flex items-center gap-3 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200 bg-slate-50/70'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center shadow-md border border-emerald-400/30 flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1
            className={`font-bold text-base tracking-tight leading-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.appName}
          </h1>
          <p
            className={`text-xs font-normal truncate ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* User Role Profile Pill */}
      <div
        className={`px-4 py-3.5 border-b cursor-pointer transition ${
          isDark
            ? 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-900/80'
            : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60'
        }`}
        onClick={openRoleMatrixModal}
        title={lang === 'th' ? 'คลิกเพื่อดูผังสิทธิ์การใช้งาน (RBAC)' : 'Click to view Role Permissions'}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full border font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-inner ${
              currentRole === 'ceo'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : isDark
                ? 'bg-slate-800 border-slate-700 text-sky-400'
                : 'bg-slate-200 border-slate-300 text-slate-700'
            }`}
          >
            {currentRole === 'ceo' ? '👑' : currentRole === 'admin' ? 'AD' : currentRole === 'sales' ? 'SL' : currentRole === 'warehouse' ? 'WH' : 'AC'}
          </div>
          <div className="overflow-hidden leading-tight flex-1">
            <div
              className={`text-sm font-semibold truncate flex items-center gap-1.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span>{lang === 'th' ? activeRoleDetail.nameTh : activeRoleDetail.nameEn}</span>
              {currentRole === 'ceo' && !isCeoUnlocked && (
                <Lock className="w-3 h-3 text-rose-400" />
              )}
            </div>
            <div
              className={`text-xs font-light truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {lang === 'th' ? activeRoleDetail.badgeTh : activeRoleDetail.badgeEn}
            </div>
          </div>
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            title={t.online}
          />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div
          className={`px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {t.mainMenu}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left group ${
                isActive
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'bg-slate-100 text-emerald-800 shadow-xs border border-slate-300/80 font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? isDark
                        ? 'text-sky-400'
                        : 'text-emerald-700'
                      : isDark
                      ? 'text-slate-400 group-hover:text-slate-200'
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                    item.badgeColor ||
                    (isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-200 text-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Operational Tools Section */}
        <div
          className={`pt-4 px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {t.operationalTools}
        </div>

        {/* CEO Directives & Notes to Admin Button */}
        <button
          onClick={openCeoDirectivesModal}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
            currentRole === 'ceo'
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
              : isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-800/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="truncate">
              {lang === 'th' ? 'ข้อสั่งการ CEO & โน้ตถึง Admin' : 'CEO Directives to Admin'}
            </span>
          </div>
          {pendingDirectivesCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-slate-950">
              {pendingDirectivesCount}
            </span>
          )}
        </button>

        {/* Role Matrix Button */}
        <button
          onClick={openRoleMatrixModal}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-800/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="truncate">
              {lang === 'th' ? 'ผังสิทธิ์บทบาท (RBAC)' : 'Role Permissions'}
            </span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border ${
              isDark
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            5 Roles
          </span>
        </button>

        {/* Quote Builder */}
        <button
          onClick={openQuoteModal}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-800/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="truncate">{t.calculateQuote}</span>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          />
        </button>

        {/* GitHub 7 Documents */}
        <button
          onClick={openDocsModal}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-800/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{t.githubDocs}</span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border ${
              isDark
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            7.md
          </span>
        </button>
      </nav>

      {/* Footer Info */}
      <div
        className={`p-3 border-t text-[11px] flex items-center justify-between transition-colors ${
          isDark
            ? 'border-slate-800/80 text-slate-500 bg-slate-950/60'
            : 'border-slate-200 text-slate-500 bg-slate-50'
        }`}
      >
        <span>{t.expressReady}</span>
        <span className="text-emerald-500 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> v1.2 (RBAC)
        </span>
      </div>
    </aside>
  );
};
