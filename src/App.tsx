import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  CashSale,
  CreditInvoice,
  DepositReceipt,
  StockItem,
  DeliveryJob,
  UserRoleId,
  CeoDirective,
} from './types';
import {
  INITIAL_CASH_SALES,
  INITIAL_CREDIT_INVOICES,
  INITIAL_DEPOSIT_RECEIPTS,
  INITIAL_STOCK_ITEMS,
  INITIAL_DELIVERY_JOBS,
} from './data/sampleData';
import { INITIAL_CEO_DIRECTIVES } from './data/rolePermissions';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DataImportView } from './components/DataImportView';
import { ExecutiveOverviewView } from './components/ExecutiveOverviewView';
import { StockHealthView } from './components/StockHealthView';
import { JobDeliveryView } from './components/JobDeliveryView';
import { CustomersView } from './components/CustomersView';
import { CreditSalesARView } from './components/CreditSalesARView';
import { DepositReceiptsView } from './components/DepositReceiptsView';
import { SmartRecommendationsView } from './components/SmartRecommendationsView';
import { QuoteBuilderModal } from './components/QuoteBuilderModal';
import { GitHubDocumentsModal } from './components/GitHubDocumentsModal';
import { CeoPasswordModal } from './components/CeoPasswordModal';
import { CeoDirectivesModal } from './components/CeoDirectivesModal';
import { RoleMatrixModal } from './components/RoleMatrixModal';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';

const STORAGE_KEY = 'pu_roof_works_state_v1';

export default function App() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();

  // Default active tab: 'import' matches the user's preview.webp screenshot exactly
  const [activeTab, setActiveTab] = useState<ActiveTab>('import');
  
  // RBAC Roles: 'ceo' | 'admin' | 'sales' | 'warehouse' | 'accounting'
  const [currentRole, setCurrentRole] = useState<UserRoleId>('ceo');
  const [isCeoUnlocked, setIsCeoUnlocked] = useState<boolean>(true);
  
  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [ceoPasswordModalOpen, setCeoPasswordModalOpen] = useState(false);
  const [ceoDirectivesModalOpen, setCeoDirectivesModalOpen] = useState(false);
  const [roleMatrixModalOpen, setRoleMatrixModalOpen] = useState(false);

  // CEO Directives & Communication Thread with Admin
  const [directives, setDirectives] = useState<CeoDirective[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_directives');
      return saved ? JSON.parse(saved) : INITIAL_CEO_DIRECTIVES;
    } catch {
      return INITIAL_CEO_DIRECTIVES;
    }
  });

  // Core Data States
  const [cashSales, setCashSales] = useState<CashSale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_cash');
      return saved ? JSON.parse(saved) : INITIAL_CASH_SALES;
    } catch {
      return INITIAL_CASH_SALES;
    }
  });

  const [creditInvoices, setCreditInvoices] = useState<CreditInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_invoices');
      return saved ? JSON.parse(saved) : INITIAL_CREDIT_INVOICES;
    } catch {
      return INITIAL_CREDIT_INVOICES;
    }
  });

  const [depositReceipts, setDepositReceipts] = useState<DepositReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_deposits');
      return saved ? JSON.parse(saved) : INITIAL_DEPOSIT_RECEIPTS;
    } catch {
      return INITIAL_DEPOSIT_RECEIPTS;
    }
  });

  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [deliveryJobs, setDeliveryJobs] = useState<DeliveryJob[]>(INITIAL_DELIVERY_JOBS);

  // Sync core data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_cash', JSON.stringify(cashSales));
      localStorage.setItem(STORAGE_KEY + '_invoices', JSON.stringify(creditInvoices));
      localStorage.setItem(STORAGE_KEY + '_deposits', JSON.stringify(depositReceipts));
      localStorage.setItem(STORAGE_KEY + '_directives', JSON.stringify(directives));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cashSales, creditInvoices, depositReceipts, directives]);

  const handleUpdateData = (
    newCash: CashSale[],
    newInvoices: CreditInvoice[],
    newDeposits: DepositReceipt[]
  ) => {
    setCashSales(newCash);
    setCreditInvoices(newInvoices);
    setDepositReceipts(newDeposits);
  };

  const handleResetSample = () => {
    setCashSales(INITIAL_CASH_SALES);
    setCreditInvoices(INITIAL_CREDIT_INVOICES);
    setDepositReceipts(INITIAL_DEPOSIT_RECEIPTS);
    setStockItems(INITIAL_STOCK_ITEMS);
    setDeliveryJobs(INITIAL_DELIVERY_JOBS);
  };

  const handleClearAll = () => {
    if (window.confirm(lang === 'th' ? 'ยืนยันการล้างข้อมูลทั้งหมดในระบบหรือไม่? (ต้องใช้สิทธิ์ CEO)' : 'Confirm clearing all data from the system? (CEO Authority Required)')) {
      setCashSales([]);
      setCreditInvoices([]);
      setDepositReceipts([]);
    }
  };

  const handleUpdateJobStatus = (id: string, newStatus: DeliveryJob['status']) => {
    setDeliveryJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
  };

  // Role Switcher with CEO Password (1234) Gate
  const handleSelectRole = (role: UserRoleId) => {
    if (role === 'ceo' && !isCeoUnlocked) {
      setCeoPasswordModalOpen(true);
      return;
    }
    setCurrentRole(role);
  };

  const handleCeoUnlockedSuccess = () => {
    setIsCeoUnlocked(true);
    setCurrentRole('ceo');
  };

  const pendingJobsCount = deliveryJobs.filter((j) => j.status !== 'จัดส่งเรียบร้อย').length;
  const totalRecordsCount = cashSales.length + creditInvoices.length + depositReceipts.length;
  const pendingDirectivesCount = directives.filter((d) => d.status !== 'completed').length;

  return (
    <div
      className={`flex h-screen overflow-hidden font-['Prompt',sans-serif] transition-colors duration-150 ${
        isDark ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sidebar with Role Status, Directives, and Modals */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openQuoteModal={() => setQuoteModalOpen(true)}
        openDocsModal={() => setDocsModalOpen(true)}
        openCeoDirectivesModal={() => setCeoDirectivesModalOpen(true)}
        openRoleMatrixModal={() => setRoleMatrixModalOpen(true)}
        pendingJobsCount={pendingJobsCount}
        cashSalesCount={cashSales.length}
        invoicesCount={creditInvoices.length}
        depositsCount={depositReceipts.length}
        currentRole={currentRole}
        pendingDirectivesCount={pendingDirectivesCount}
        isCeoUnlocked={isCeoUnlocked}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          isCeoUnlocked={isCeoUnlocked}
          onResetSampleData={handleResetSample}
          totalRecordsCount={totalRecordsCount}
          onOpenCeoDirectives={() => setCeoDirectivesModalOpen(true)}
          onOpenRoleMatrix={() => setRoleMatrixModalOpen(true)}
          pendingDirectivesCount={pendingDirectivesCount}
        />

        {/* Tab Views */}
        <main className="flex-1 pb-16">
          {activeTab === 'import' && (
            <DataImportView
              cashSales={cashSales}
              creditInvoices={creditInvoices}
              depositReceipts={depositReceipts}
              onUpdateData={handleUpdateData}
              onResetSample={handleResetSample}
              onClearAll={handleClearAll}
              currentRole={currentRole}
              onRequestCeoUnlock={() => setCeoPasswordModalOpen(true)}
            />
          )}

          {activeTab === 'overview' && (
            <ExecutiveOverviewView
              cashSales={cashSales}
              creditInvoices={creditInvoices}
              depositReceipts={depositReceipts}
              stockItems={stockItems}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'stock' && (
            <StockHealthView
              stockItems={stockItems}
              openQuoteModal={() => setQuoteModalOpen(true)}
            />
          )}

          {activeTab === 'jobs' && (
            <JobDeliveryView
              jobs={deliveryJobs}
              onUpdateJobStatus={handleUpdateJobStatus}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              creditInvoices={creditInvoices}
              cashSales={cashSales}
            />
          )}

          {activeTab === 'ar' && (
            <CreditSalesARView
              creditInvoices={creditInvoices}
            />
          )}

          {activeTab === 'deposits' && (
            <DepositReceiptsView
              depositReceipts={depositReceipts}
            />
          )}

          {activeTab === 'recommendations' && (
            <SmartRecommendationsView
              stockItems={stockItems}
              creditInvoices={creditInvoices}
              cashSales={cashSales}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              openQuoteModal={() => setQuoteModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Track B Quote Builder Modal with CEO Override */}
      <QuoteBuilderModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        stockItems={stockItems}
        currentRole={currentRole}
        isCeoUnlocked={isCeoUnlocked}
        onRequestCeoUnlock={() => setCeoPasswordModalOpen(true)}
      />

      {/* GitHub 7-Documents Modal (including rbac.md) */}
      <GitHubDocumentsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />

      {/* CEO PIN Verification Modal (1234) */}
      <CeoPasswordModal
        isOpen={ceoPasswordModalOpen}
        onClose={() => setCeoPasswordModalOpen(false)}
        onSuccess={handleCeoUnlockedSuccess}
      />

      {/* CEO Directives & Communication Thread Modal */}
      <CeoDirectivesModal
        isOpen={ceoDirectivesModalOpen}
        onClose={() => setCeoDirectivesModalOpen(false)}
        currentRole={currentRole}
        directives={directives}
        onUpdateDirectives={(newDirs) => setDirectives(newDirs)}
        onRequestCeoUnlock={() => setCeoPasswordModalOpen(true)}
        isCeoUnlocked={isCeoUnlocked}
      />

      {/* Role Permission Matrix (RBAC) Modal */}
      <RoleMatrixModal
        isOpen={roleMatrixModalOpen}
        onClose={() => setRoleMatrixModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}
