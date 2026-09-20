import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  Check,
  RefreshCw,
  Sun,
  Moon,
  MessageSquare,
  Lock,
  Unlock,
  Shield,
} from 'lucide-react';
import { ActiveTab, UserRoleId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ROLE_DETAILS } from '../data/rolePermissions';

interface HeaderProps {
  activeTab: ActiveTab;
  currentRole: UserRoleId;
  onSelectRole: (role: UserRoleId) => void;
  isCeoUnlocked: boolean;
  onResetSampleData: () => void;
  totalRecordsCount: number;
  onOpenCeoDirectives: () => void;
  onOpenRoleMatrix: () => void;
  pendingDirectivesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentRole,
  onSelectRole,
  isCeoUnlocked,
  onResetSampleData,
  totalRecordsCount,
  onOpenCeoDirectives,
  onOpenRoleMatrix,
  pendingDirectivesCount,
}) => {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleList: UserRoleId[] = ['ceo', 'admin', 'sales', 'warehouse', 'accounting'];

  const currentTabMeta = t.titles[activeTab] || t.titles.import;
  const activeRoleDetail = ROLE_DETAILS[currentRole];

  return (
    <header
      className={`border-b sticky top-0 z-20 transition-colors ${
        isDark ? 'bg-[#0a0f1d] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Top Banner Row */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {currentTabMeta.title}
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentTabMeta.subtitle}
          </p>
        </div>

        {/* Right Action Tools & Selectors */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* CEO Directives & Notes to Admin Button */}
          <button
            onClick={onOpenCeoDirectives}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              currentRole === 'ceo'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-xs'
                : isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/30'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
            }`}
            title={
              lang === 'th'
                ? 'ข้อสั่งการ CEO & โน้ตกำชับถึงแอดมิน (CEO Directives)'
                : 'CEO Directives & Notes to Admin'
            }
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'ข้อสั่งการ CEO ถึง Admin' : 'CEO Directives'}</span>
            {pendingDirectivesCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentRole === 'ceo'
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {pendingDirectivesCount}
              </span>
            )}
          </button>

          {/* Role Permissions (RBAC) Matrix button */}
          <button
            onClick={onOpenRoleMatrix}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-indigo-500/30'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}
            title={
              lang === 'th'
                ? 'เปิดดูผังสิทธิ์การใช้งานแต่ละบทบาท (RBAC Matrix)'
                : 'Role Permission Matrix (RBAC)'
            }
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'th' ? 'สิทธิ์บทบาท (RBAC)' : 'Roles (RBAC)'}</span>
          </button>

          {/* Language Switcher (Thai / English) */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setLang('th')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                lang === 'th'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="เปลี่ยนเป็นภาษาไทย"
            >
              <span>🇹🇭 TH</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧 EN</span>
            </button>
          </div>

          {/* Theme Switcher (Light / Black) */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t.themeLight}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t.themeLight}</span>
            </button>
            <button
              onClick={() => setTheme('black')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                theme === 'black'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t.themeBlack}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t.themeBlack}</span>
            </button>
          </div>

          {/* Reset Sample Button */}
          <button
            onClick={onResetSampleData}
            title={t.sampleDataNotice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'text-slate-300 bg-slate-900 hover:bg-slate-800 border-slate-700'
                : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-300 shadow-xs'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
            <span>
              {t.sampleDataNotice} ({totalRecordsCount} {t.records})
            </span>
          </button>

          {/* Role Pill Dropdown with CEO Password Security Indicator */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                currentRole === 'ceo'
                  ? isCeoUnlocked
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/40'
                  : isDark
                  ? 'text-white bg-slate-900 hover:bg-slate-800 border-slate-700'
                  : 'text-slate-900 bg-white hover:bg-slate-50 border-slate-300 shadow-xs'
              }`}
            >
              {currentRole === 'ceo' ? (
                isCeoUnlocked ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                )
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span>
                {lang === 'th' ? activeRoleDetail.nameTh : activeRoleDetail.nameEn}
                {currentRole === 'ceo' && (isCeoUnlocked ? ' (1234 ✓)' : ' (🔒 1234)')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className={`absolute right-0 mt-1.5 w-72 border rounded-xl shadow-xl py-1 z-50 text-xs ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`px-3 py-1.5 text-[10px] uppercase font-semibold border-b flex items-center justify-between ${
                    isDark
                      ? 'text-slate-400 border-slate-800'
                      : 'text-slate-500 border-slate-100'
                  }`}
                >
                  <span>{t.roles.roleSwitchTitle}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoleDropdownOpen(false);
                      onOpenRoleMatrix();
                    }}
                    className="text-indigo-400 hover:underline capitalize"
                  >
                    {lang === 'th' ? 'ดูผังสิทธิ์' : 'View Matrix'}
                  </button>
                </div>

                {roleList.map((rKey) => {
                  const detail = ROLE_DETAILS[rKey];
                  const isSelected = currentRole === rKey;
                  const isCeo = rKey === 'ceo';

                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        onSelectRole(rKey);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-800/80 font-bold'
                            : 'bg-slate-100 font-bold'
                          : isDark
                          ? 'hover:bg-slate-800'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          {isCeo ? (
                            <span className="text-amber-500 font-bold">👑</span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          )}
                          <span>{lang === 'th' ? detail.nameTh : detail.nameEn}</span>
                          {isCeo && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                              PIN: 1234
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-3">
                          {lang === 'th' ? detail.badgeTh : detail.badgeEn}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tri-color Accent Stripe */}
      <div className="h-1 w-full flex">
        <div className="w-1/2 bg-emerald-500" />
        <div className="w-1/3 bg-amber-500" />
        <div className="w-1/6 bg-rose-500" />
      </div>

      {/* Executive Subheader Banner */}
      <div
        className={`px-6 py-2 border-t flex items-center justify-between text-xs transition-colors ${
          isDark
            ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          <span
            className={`px-2 py-0.5 rounded font-medium text-[11px] border ${
              isDark
                ? 'bg-slate-900 text-sky-400 border-slate-700'
                : 'bg-white text-sky-700 border-slate-200 shadow-2xs'
            }`}
          >
            {t.roles.executiveView}
          </span>
          <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>
            {currentTabMeta.banner}
          </span>
        </div>

        {/* Current Role Capability Summary */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            {lang === 'th' ? 'สิทธิ์ใช้งาน:' : 'Permissions:'}
          </span>
          <span className="text-amber-400 font-medium">
            {currentRole === 'ceo'
              ? lang === 'th'
                ? 'ทำได้ทุกอย่าง (100% Unrestricted) & สั่งการ Admin'
                : 'Full Control & Directives to Admin'
              : lang === 'th'
              ? `${activeRoleDetail.badgeTh} (ทำเฉพาะหน้าที่)`
              : `${activeRoleDetail.badgeEn} (Role Specific)`}
          </span>
        </div>
      </div>
    </header>
  );
};
