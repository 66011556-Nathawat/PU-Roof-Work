import React, { useState } from 'react';
import {
  X,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Shield,
  Trash2,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { CeoDirective, UserRoleId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface CeoDirectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRoleId;
  directives: CeoDirective[];
  onUpdateDirectives: (directives: CeoDirective[]) => void;
  onRequestCeoUnlock?: () => void;
  isCeoUnlocked: boolean;
}

export const CeoDirectivesModal: React.FC<CeoDirectivesModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  directives,
  onUpdateDirectives,
  onRequestCeoUnlock,
  isCeoUnlocked,
}) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'admin' | 'sales' | 'warehouse' | 'accounting'>('all');
  const [activeDirectiveId, setActiveDirectiveId] = useState<string | null>(
    directives.length > 0 ? directives[0].id : null
  );
  const [showNewForm, setShowNewForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTargetRole, setNewTargetRole] = useState<'admin' | 'sales' | 'warehouse' | 'accounting' | 'all'>('admin');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal'>('urgent');
  const [newDueDate, setNewDueDate] = useState('');

  if (!isOpen) return null;

  const isCeo = currentRole === 'ceo' && isCeoUnlocked;

  const filteredDirectives = directives.filter((d) => {
    if (selectedRoleFilter === 'all') return true;
    return d.targetRole === selectedRoleFilter || d.targetRole === 'all';
  });

  const activeDirective =
    directives.find((d) => d.id === activeDirectiveId) ||
    filteredDirectives[0] ||
    directives[0];

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDirective: CeoDirective = {
      id: 'dir-' + Date.now(),
      title: newTitle.trim(),
      targetRole: newTargetRole,
      priority: newPriority,
      content: newContent.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dueDate: newDueDate || undefined,
      status: 'pending',
      createdBy: 'คุณชาเอม (CEO)',
      comments: [
        {
          id: 'c-' + Date.now(),
          author: 'คุณชาเอม (CEO)',
          role: 'ผู้บริหาร (CEO)',
          content: 'มอบหมายงานให้ ' + getRoleName(newTargetRole) + ' ดำเนินการและรายงานผล',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };

    const updated = [newDirective, ...directives];
    onUpdateDirectives(updated);
    setActiveDirectiveId(newDirective.id);
    setShowNewForm(false);
    setNewTitle('');
    setNewContent('');
    setNewDueDate('');
  };

  const handleAddComment = (directiveId: string) => {
    if (!replyText.trim()) return;

    let authorName = 'คุณชาเอม (CEO)';
    let roleLabel = 'ผู้บริหาร (CEO)';

    if (currentRole === 'admin') {
      authorName = 'สมศักดิ์ (Admin)';
      roleLabel = 'ผู้ดูแลระบบ (Admin)';
    } else if (currentRole === 'sales') {
      authorName = 'ธีรศักดิ์ (ฝ่ายขาย)';
      roleLabel = 'ผู้จัดการฝ่ายขาย';
    } else if (currentRole === 'warehouse') {
      authorName = 'มานพ (ฝ่ายคลัง/ผลิต)';
      roleLabel = 'เจ้าหน้าที่คลังสินค้า';
    } else if (currentRole === 'accounting') {
      authorName = 'วิภา (ฝ่ายบัญชี)';
      roleLabel = 'ฝ่ายบัญชีและการเงิน';
    }

    const updated = directives.map((d) => {
      if (d.id === directiveId) {
        return {
          ...d,
          status: d.status === 'pending' ? ('in_progress' as const) : d.status,
          comments: [
            ...d.comments,
            {
              id: 'c-' + Date.now(),
              author: authorName,
              role: roleLabel,
              content: replyText.trim(),
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ],
        };
      }
      return d;
    });

    onUpdateDirectives(updated);
    setReplyText('');
  };

  const handleUpdateStatus = (directiveId: string, newStatus: CeoDirective['status']) => {
    const updated = directives.map((d) => (d.id === directiveId ? { ...d, status: newStatus } : d));
    onUpdateDirectives(updated);
  };

  const handleDeleteDirective = (directiveId: string) => {
    if (window.confirm(lang === 'th' ? 'ต้องการลบข้อสั่งการนี้หรือไม่?' : 'Delete this directive?')) {
      const updated = directives.filter((d) => d.id !== directiveId);
      onUpdateDirectives(updated);
      if (activeDirectiveId === directiveId) {
        setActiveDirectiveId(updated[0]?.id || null);
      }
    }
  };

  function getRoleName(role: string) {
    switch (role) {
      case 'admin':
        return lang === 'th' ? 'แอดมิน (Admin)' : 'Admin';
      case 'sales':
        return lang === 'th' ? 'ฝ่ายขาย (Sales)' : 'Sales Manager';
      case 'warehouse':
        return lang === 'th' ? 'ฝ่ายคลัง/ผลิต (Warehouse)' : 'Warehouse';
      case 'accounting':
        return lang === 'th' ? 'ฝ่ายบัญชี (Accounting)' : 'Accounting';
      case 'all':
        return lang === 'th' ? 'ทุกฝ่าย (All)' : 'All Departments';
      default:
        return role;
    }
  }

  const modalBgCls = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

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
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  {lang === 'th'
                    ? 'ข้อสั่งการ CEO & โน้ตกำชับถึงแอดมิน (Executive Directives)'
                    : 'CEO Directives & Notes to Admin'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  {isCeo
                    ? lang === 'th'
                      ? '👑 โหมด CEO ปลดล็อก (1234)'
                      : '👑 CEO Mode Unlocked (1234)'
                    : getRoleName(currentRole)}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th'
                  ? 'ช่องทางสั่งการและกำชับงานด่วนจากผู้บริหารสูงสุดถึงแอดมินและหัวหน้าฝ่าย พร้อมระบบตอบกลับติดตามผล'
                  : 'Direct channel from CEO to Admin and functional managers with comment threads'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCeo && onRequestCeoUnlock && (
              <button
                onClick={onRequestCeoUnlock}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 transition flex items-center gap-1.5"
              >
                <span>{lang === 'th' ? 'ปลดล็อกสิทธิ์ CEO (รหัส: 1234)' : 'Unlock CEO (PIN: 1234)'}</span>
              </button>
            )}
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
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Directives List */}
          <div
            className={`md:col-span-5 border-r flex flex-col overflow-hidden ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            {/* Filter Bar & Action */}
            <div className="p-3 border-b space-y-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'th' ? 'กรองตามผู้รับงาน' : 'Filter Target'}</span>
                </div>
                {isCeo ? (
                  <button
                    onClick={() => setShowNewForm(!showNewForm)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? '+ สร้างข้อสั่งการใหม่' : '+ New Directive'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    {lang === 'th' ? 'เฉพาะ CEO สร้างคำสั่งได้' : 'CEO-only Creation'}
                  </span>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {(['all', 'admin', 'sales', 'warehouse', 'accounting'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleFilter(r)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                      selectedRoleFilter === r
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r === 'all' ? (lang === 'th' ? 'ทั้งหมด' : 'All') : getRoleName(r)}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredDirectives.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  {lang === 'th' ? 'ไม่มีข้อสั่งการในหมวดหมู่นี้' : 'No directives found'}
                </div>
              ) : (
                filteredDirectives.map((item) => {
                  const isSelected = activeDirective?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveDirectiveId(item.id);
                        setShowNewForm(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                            : 'bg-amber-50/80 border-amber-400 shadow-sm'
                          : isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                          : 'bg-white border-slate-200 hover:bg-slate-100/70 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              : item.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          }`}
                        >
                          {item.priority === 'urgent'
                            ? lang === 'th'
                              ? 'ด่วนที่สุด'
                              : 'Urgent'
                            : item.priority === 'high'
                            ? lang === 'th'
                              ? 'สำคัญ'
                              : 'High'
                            : lang === 'th'
                            ? 'ทั่วไป'
                            : 'Normal'}
                        </span>

                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                            item.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : item.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-700/40 text-slate-300'
                          }`}
                        >
                          {item.status === 'completed'
                            ? lang === 'th'
                              ? 'เสร็จสิ้น'
                              : 'Completed'
                            : item.status === 'in_progress'
                            ? lang === 'th'
                              ? 'กำลังทำ'
                              : 'In Progress'
                            : lang === 'th'
                            ? 'รอเริ่ม'
                            : 'Pending'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold line-clamp-1">{item.title}</h4>
                      <p
                        className={`text-[11px] line-clamp-2 mt-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {item.content}
                      </p>

                      <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-slate-500">
                        <span>ถึง: {getRoleName(item.targetRole)}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {item.comments.length}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Details & Comments Thread */}
          <div className="md:col-span-7 flex flex-col overflow-hidden">
            {showNewForm && isCeo ? (
              /* New Directive Form */
              <form onSubmit={handleCreateDirective} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-2 text-amber-500">
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'th' ? 'สร้างข้อสั่งการและโน้ตใหม่ (CEO)' : 'Create New CEO Directive'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'th' ? 'หัวข้อคำสั่ง / ประเด็นกำชับ' : 'Directive Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={
                      lang === 'th'
                        ? 'เช่น ตรวจสอบความถูกต้องของยอดขายเงินสดก่อนส่งสรุป'
                        : 'e.g. Verify cash sales CSV before closing report'
                    }
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {lang === 'th' ? 'มอบหมายให้ฝ่าย (Target Role)' : 'Assign To'}
                    </label>
                    <select
                      value={newTargetRole}
                      onChange={(e) => setNewTargetRole(e.target.value as any)}
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="admin">แอดมินระบบ (Admin)</option>
                      <option value="sales">ผู้จัดการฝ่ายขาย (Sales)</option>
                      <option value="warehouse">เจ้าหน้าที่คลังสินค้าและผลิต (Warehouse)</option>
                      <option value="accounting">ฝ่ายบัญชีและการเงิน (Accounting)</option>
                      <option value="all">ทุกฝ่าย (All Departments)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {lang === 'th' ? 'ระดับความเร่งด่วน (Priority)' : 'Priority'}
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="urgent">🔴 ด่วนที่สุด (Urgent)</option>
                      <option value="high">🟡 สำคัญ (High)</option>
                      <option value="normal">🔵 ทั่วไป (Normal)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'th' ? 'กำหนดส่ง / เป้าหมายเวลา (Due Date)' : 'Target Due Date'}
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'th' ? 'รายละเอียดข้อสั่งการและคำกำชับ' : 'Directive Details'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={
                      lang === 'th'
                        ? 'ระบุเนื้อหาคำสั่ง ข้อมูลที่ต้องตรวจเช็ก และผลลัพธ์ที่ต้องการเห็นจากแอดมินหรือทีมงาน...'
                        : 'Specify instructions, required checks, and deliverables...'
                    }
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 hover:bg-slate-800"
                  >
                    {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'บันทึกและส่งข้อสั่งการ' : 'Post Directive'}</span>
                  </button>
                </div>
              </form>
            ) : activeDirective ? (
              /* Directive Details & Comments */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Directive Top Card */}
                <div className="p-5 border-b space-y-3 flex-shrink-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            activeDirective.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {activeDirective.priority.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {activeDirective.createdAt}
                        </span>
                        <span className="text-[11px] text-amber-500 font-medium">
                          โดย: {activeDirective.createdBy}
                        </span>
                      </div>
                      <h4 className="text-base font-bold">{activeDirective.title}</h4>
                    </div>

                    {isCeo && (
                      <button
                        onClick={() => handleDeleteDirective(activeDirective.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded-md transition"
                        title={lang === 'th' ? 'ลบคำสั่งนี้' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p
                    className={`text-xs leading-relaxed p-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {activeDirective.content}
                  </p>

                  {/* Status update bar */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{lang === 'th' ? 'สถานะงาน:' : 'Status:'}</span>
                      <div className="flex gap-1">
                        {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                          <button
                            key={s}
                            disabled={!isCeo && currentRole !== 'admin' && activeDirective.targetRole !== currentRole}
                            onClick={() => handleUpdateStatus(activeDirective.id, s)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                              activeDirective.status === s
                                ? s === 'completed'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : s === 'in_progress'
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-slate-700 text-white'
                                : isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {s === 'completed'
                              ? lang === 'th'
                                ? '✓ เสร็จสิ้น'
                                : '✓ Completed'
                              : s === 'in_progress'
                              ? lang === 'th'
                                ? '⏳ กำลังทำ'
                                : '⏳ In Progress'
                              : lang === 'th'
                              ? 'รอเริ่ม'
                              : 'Pending'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeDirective.dueDate && (
                      <span className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {lang === 'th' ? 'กำหนดส่ง:' : 'Due:'} {activeDirective.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comments & Replies Thread */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {lang === 'th'
                        ? 'ประวัติการตอบกลับและการรายงานผล (Comments & Audit Log)'
                        : 'Communication & Progress Updates'}
                    </span>
                  </div>

                  {activeDirective.comments.map((c) => {
                    const isFromCeo = c.role.includes('CEO');
                    return (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          isFromCeo
                            ? isDark
                              ? 'bg-amber-950/20 border-amber-500/30'
                              : 'bg-amber-50 border-amber-200'
                            : isDark
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-white border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isFromCeo ? 'bg-amber-500' : 'bg-sky-500'
                              }`}
                            />
                            <span>{c.author}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({c.role})
                            </span>
                          </span>
                          <span className="text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className={`pl-3.5 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {c.content}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input Bar */}
                <div
                  className={`p-3 border-t flex items-center gap-2 flex-shrink-0 ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(activeDirective.id);
                        }
                      }}
                      placeholder={
                        isCeo
                          ? lang === 'th'
                            ? 'พิมพ์คำสั่งเพิ่มเติม หรือตอบกลับแอดมินในฐานะ CEO...'
                            : 'Add follow-up notes as CEO...'
                          : lang === 'th'
                          ? `พิมพ์ข้อความตอบกลับหรือรายงานผลในฐานะ ${getRoleName(currentRole)}...`
                          : `Reply or update progress as ${getRoleName(currentRole)}...`
                      }
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-400'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500 shadow-xs'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => handleAddComment(activeDirective.id)}
                    disabled={!replyText.trim()}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      replyText.trim()
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'ส่งคำตอบ' : 'Send'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Shield className="w-12 h-12 text-slate-600 mb-2 opacity-40" />
                <p className="text-xs">
                  {lang === 'th' ? 'เลือกข้อสั่งการจากรายการด้านซ้าย' : 'Select a directive from the left list'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs flex-shrink-0 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {lang === 'th'
                ? 'ข้อมูลข้อสั่งการบันทึกอัตโนมัติในเครื่อง (LocalStorage persistence)'
                : 'Directives automatically persist in LocalStorage'}
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
