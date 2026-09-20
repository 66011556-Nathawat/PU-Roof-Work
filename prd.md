# PRD: PU Roof Works Company Operations & Express Hub

## What
An executive and operational decision-support dashboard built for **PU Roof Works** (ผู้ผลิตและจำหน่ายหลังคาเหล็กเมทัลชีท บุฉนวนพียูโฟม). The system ingests 3 standard CSV files exported directly from Express Accounting Software:
1. **Cash Sales (CSV ขายเงินสด)**
2. **Invoices & Credit Sales (CSV ใบกำกับสินค้า / ขายเชื่อ)**
3. **Deposit Receipts (CSV ใบรับมัดจำ)**

## Why
In typical metal roofing manufacturing, operations and accounting face critical daily decisions:
- Knowing whether monthly sales targets will be hit while the month is still active (Track A: Run Rate & Seasonal Projection).
- Preventing bad debt and prioritizing aging accounts receivable collection before overdue passes 60+ days.
- Managing high-turnover coil & PU foam raw materials while pushing aging dead stock (Track B: Days of Cover & Reorder Point).
- Ensuring custom roof quotes maintain an uncompromised profit margin floor without pricing out competitive bids.

## Who (User Personas)
- **Primary Persona**: คุณชาเอม, ผู้บริหาร (CEO) — Needs high-level company pulse, sales run rate vs target, credit risk exposure, and actionable alerts in 30 seconds.
- **Secondary Persona**: ผู้จัดการฝ่ายขาย & แคชเชียร์ — Imports daily Express CSV exports, tracks cash sales, issues defensible quotes with margin guardrails.
- **Warehouse & Production Manager**: Monitors coil rolls, PU chemical drums, delivery schedules, and orders under production.

## Core Features
1. **Express 3-CSV File Ingestion**:
   - Drag & drop or file picker with smart auto-detection for Cash Sales, Invoices, and Deposit Receipts.
   - Built-in realistic sample data button ("ใช้ข้อมูลตัวอย่าง") and sample CSV file downloads.
2. **Executive Overview & Track A Sales Forecast**:
   - Month-to-date sales, elapsed working days, run rate, seasonal index, low/base/high forecast band.
   - Ahead / On Track / Behind direction indicator vs ฿2.5M monthly target.
   - Breakdown of top performing products and sales by branch.
3. **Inventory & Track B Stock Health**:
   - Days of cover, reorder alerts (low stock / out of stock), and overstock push list (>90 days).
   - Interactive Quote Builder with live margin computation and floor/ceiling guardrails.
4. **Credit Sales & AR Aging**:
   - Outstanding debt categorised by aging buckets (0-30, 31-60, 61-90, 90+ days).
   - High-risk debtor flags and follow-up status.
5. **Deposit Receipt Tracking**:
   - Track active down-payments for custom roofing runs, matched against issued invoices.
6. **Smart Automated Recommendations**:
   - Immediate prioritized action items for procurement, sales push, and debt collection.

## Out of Scope
- No direct database writeback to Express proprietary DB files (relies on clean CSV export/import).
- No external unauthenticated third-party APIs.
- Offline-ready client-side state with local storage backup.

## Success Criteria
- Instant parsing of 3 Express CSV files with zero pre-formatting required.
- Forecast computation within 100ms adhering to verified operational formulas (MAPE < 15%).
- Complete visibility of company cash, receivables, deposits, and stock in one unified screen.
