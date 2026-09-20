# Role-Based Access Control (RBAC) & Operational Governance
**PU Roof Works — Metal Sheet & PU Foam Manufacturing Decision Hub**

This document specifies the exact permissions, boundaries, and security model governing all user roles in the PU Roof Works platform.

---

## 1. Executive Summary & Security Model

The system enforces strict **Separation of Concerns (SoC)** aligned with Thai industrial manufacturing workflows.
- **CEO (ผู้บริหารสูงสุด)**: Possesses master capabilities across 100% of all platform modules and functions. The CEO can issue **Executive Directives, Notes, and Comments** directly to the System Admin and functional departments. Access to this role is protected by a dedicated **Master Security PIN: `1234`**.
- **Admin (ผู้ดูแลระบบ)**: Manages data ingestion pipelines (Express 3-CSV sync), data integrity audits, and serves as the operational responder to CEO directives.
- **Functional Roles (Sales, Warehouse, Accounting)**: Can **ONLY do their job**. They are strictly restricted from performing actions outside their organizational scope (e.g., Sales cannot manipulate factory queue stages, Warehouse cannot inspect company financial profit margins, and Accounting cannot wipe databases or alter production).

---

## 2. Role Permission Matrix (Matrix แสดงสิทธิ์การเข้าถึง)

| ฟังก์ชันงาน / ระบบ (Capability) | CEO (ผู้บริหาร) 👑 | Admin (ผู้ดูแล) 🛡️ | Sales (ฝ่ายขาย) 💼 | Warehouse (คลัง/ผลิต) 📦 | Accounting (บัญชี/การเงิน) 💰 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **รหัสผ่านยืนยันสิทธิ์ (Master PIN)** | **1234** | - | - | - | - |
| **ภาพรวมบริษัท (Executive Overview & P&L)** | ✅ เต็มรูปแบบ | ✅ ดูได้ | 🟡 ยอดขายรวม | ❌ จำกัดสิทธิ์ | 🟡 บัญชี & AR |
| **การนำเข้า 3 ไฟล์ Express CSV** | ✅ ทำได้ | ✅ ทำได้ | ❌ เฉพาะดูตัวอย่าง | ❌ จำกัดสิทธิ์ | ✅ ทำได้ (ขายเชื่อ/มัดจำ) |
| **ล้างฐานข้อมูลระบบทั้งหมด (Clear All Data)** | ✅ ทำได้ (PIN 1234) | 🟡 ยืนยันสิทธิ์ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **รีเซ็ตข้อมูลตัวอย่าง (Reset Sample Data)** | ✅ ทำได้ | ✅ ทำได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **ออกข้อสั่งการ/โน้ตถึง Admin (CEO Directives)** | ✅ ทำได้ (ผู้สั่งการ) | 💬 ตอบกลับ/อัปเดต | 💬 ตอบกลับ | 💬 ตอบกลับ | 💬 ตอบกลับ |
| **ตอบกลับคอมเมนต์และอัปเดตสถานะงาน** | ✅ ทำได้ | ✅ ทำได้ | ✅ เฉพาะงานฝ่ายขาย | ✅ เฉพาะงานฝ่ายคลัง | ✅ เฉพาะงานฝ่ายบัญชี |
| **สร้างใบเสนอราคา (Track B Quote Assistant)** | ✅ ทำได้ | ✅ ทำได้ | ✅ ฟังก์ชันหลัก | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **อนุมัติส่วนลดต่ำกว่าเกณฑ์กำไร (Floor < 18%)** | ✅ **CEO Override** | ❌ ต้องขออนุมัติ | ❌ ต้องขออนุมัติ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **ตรวจสอบสต็อก & จุดสั่งซื้อ (Days of Cover/ROP)** | ✅ ดูได้ | ✅ ดูได้ | 🟡 ดูจำนวนคงเหลือ | ✅ **ฟังก์ชันหลัก** | 🟡 ดูมูลค่าสต็อก |
| **อัปเดตสถานะคิวงานผลิต/จัดส่ง (Delivery Tracker)** | ✅ อัปเดตได้ | ✅ อัปเดตได้ | ❌ เฉพาะดูวันส่งมอบ | ✅ **ฟังก์ชันหลัก** | ❌ เฉพาะดูวันส่งมอบ |
| **บริหารลูกหนี้ขายเชื่อ (Credit Invoices & AR)** | ✅ ดูได้ทั้งหมด | ✅ ดูได้ | 🟡 ดูยอดลูกค้าตนเอง | ❌ จำกัดสิทธิ์ | ✅ **ฟังก์ชันหลัก** |
| **จัดการและตัดยอดใบรับมัดจำ (Deposit Receipts)** | ✅ ดูได้ทั้งหมด | ✅ ดูได้ | 🟡 ดูยอดมัดจำที่ผูก | ❌ จำกัดสิทธิ์ | ✅ **ฟังก์ชันหลัก** |

*สัญลักษณ์: ✅ = ทำได้เต็มสิทธิ์, 🟡 = ดูข้อมูลได้เฉพาะส่วนที่เกี่ยวข้อง, ❌ = ปิดกั้นการเข้าถึง, 💬 = ตอบกลับข้อสั่งการได้*

---

## 3. Detailed Role Breakdown (รายละเอียดสิทธิ์รายบทบาท)

### 3.1 Chief Executive Officer (CEO / ผู้บริหารสูงสุด)
- **Role Identity**: คุณชาเอม (CEO)
- **Security Credential**: **PIN: `1234`**
- **Core Philosophy**: Complete operational transparency and strategic command.
- **What CEO CAN Do (สิ่งที่ทำได้)**:
  1. Full unrestricted read/write access across all 8 dashboard tabs and tools.
  2. Issue, edit, and close **Executive Directives & Notes to Admin and Departments**.
  3. Authorize **Margin Floor Overrides** on quotes with gross margin < 18%.
  4. Perform catastrophic operations (Full database wipe, factory reset to sample data).
  5. Inspect Track A monthly run rate projections, seasonal multipliers, and confidence bands.
  6. Direct factory production overrides or emergency delivery schedule reprioritizations.
- **What CEO CANNOT Do**:
  - None. Full super-user permissions.

### 3.2 System Administrator (Admin / ผู้ดูแลระบบ)
- **Role Identity**: ทีมผู้ดูแลระบบและวิศวกรข้อมูล (System Administrator)
- **Core Philosophy**: Data integrity, ingestion pipeline stability, and executive task execution.
- **What Admin CAN Do (สิ่งที่ทำได้)**:
  1. Ingest, validate, and troubleshoot 3 Express Accounting CSV files (Cash Sales, Credit Invoices, Deposits).
  2. Receive CEO Directives, add progress comments/replies, and toggle status (Pending -> In Progress -> Completed).
  3. Inspect raw data tables, debug CSV encoding (TIS-620 / UTF-8), and verify schema integrity.
  4. Assist sales, warehouse, and accounting users with operational issues.
- **What Admin CANNOT Do (สิ่งที่ทำไม่ได้)**:
  1. Originate executive policy directives in the name of the CEO.
  2. Unilaterally approve below-floor discounted sales quotes without CEO sign-off.

### 3.3 Sales Manager (ผู้จัดการฝ่ายขาย)
- **Role Identity**: ฝ่ายขายและบริการลูกค้าโครงการ
- **Core Philosophy**: Maximize revenue and profit while maintaining defensible margins.
- **What Sales CAN Do (สิ่งที่ทำได้)**:
  1. Build accurate roof quotes with metal sheet length, PU foam thickness, flashing, and screws.
  2. Monitor real-time markup percentages and ensure quotes stay within safe margin guardrails (Floor 18%, Target 25%, Ceiling 35%).
  3. Inspect daily Cash Sales transactions and customer buying history.
  4. Consult the Stock Push List (>90 days aging) to pitch promotional bundles to contractors.
  5. Reply to CEO directives assigned to Sales.
- **What Sales CANNOT Do (สิ่งที่ทำไม่ได้)**:
  1. Cannot alter or wipe the system database or delete Express CSV imports.
  2. Cannot approve quotes below the 18% floor without CEO override approval.
  3. Cannot modify factory production queue stages (e.g., cannot mark jobs as "จัดส่งเรียบร้อย").
  4. Cannot write off accounts receivable or alter deposit receipts.

### 3.4 Warehouse & Production Supervisor (เจ้าหน้าที่คลังสินค้าและผลิต)
- **Role Identity**: ฝ่ายคลังสินค้า คอยล์เหล็ก และโรงงานรีดลอน
- **Core Philosophy**: Ensure zero production downtime, maintain buffer stock, and on-time site deliveries.
- **What Warehouse CAN Do (สิ่งที่ทำได้)**:
  1. Track Days of Cover (DoC) and Reorder Points (ROP) for high-turnover raw materials (Coils, PU chemicals).
  2. Receive reorder alerts (Stock status: Low / Out of stock).
  3. Update production stages: `รอรีดลอน` (Queued) ➔ `กำลังติด PU` (Bonding) ➔ `พร้อมจัดส่ง` (Ready) ➔ `จัดส่งเรียบร้อย` (Delivered).
  4. Coordinate with roof installation crews and confirm construction site drop-off addresses.
  5. Reply to CEO directives regarding inventory and logistics.
- **What Warehouse CANNOT Do (สิ่งที่ทำไม่ได้)**:
  1. Cannot view company confidential financial P&L, profit margins, or revenue projections.
  2. Cannot access customer financial credit balances or overdue debt ledgers.
  3. Cannot issue sales quotes or alter selling prices.
  4. Cannot import financial CSV files or delete company data.

### 3.5 Accounting & Finance Manager (ฝ่ายบัญชีและการเงิน)
- **Role Identity**: ฝ่ายบัญชีลูกหนี้และการเงิน
- **Core Philosophy**: Safeguard cash flow, prevent bad debt, and reconcile customer deposits.
- **What Accounting CAN Do (สิ่งที่ทำได้)**:
  1. Ingest and reconcile Express Credit Invoices (ขายเชื่อ) and Deposit Receipts (ใบรับมัดจำ).
  2. Monitor AR aging brackets (0-30, 31-60, 61-90, 90+ days) and flag high-risk overdue contractors.
  3. Track active customer deposits, link deposits to final invoices, and compute remaining unapplied balances.
  4. Verify Cash Sales receipts and 7% VAT calculations.
  5. Reply to CEO directives regarding debtor follow-ups and debt collection.
- **What Accounting CANNOT Do (สิ่งที่ทำไม่ได้)**:
  1. Cannot alter factory production stages or reassign delivery crews.
  2. Cannot approve quotes below the profit margin floor without CEO sign-off.
  3. Cannot clear company system data without CEO verification.

---

## 4. CEO Directives & Admin Communication System
The platform includes an **Executive Directives Channel** allowing real-time operational memos between the CEO and Admin/Departments:
1. **Creation**: CEO clicks "ข้อสั่งการ CEO & โน้ตถึงแอดมิน" to create directives with:
   - Recipient (Admin, Sales, Warehouse, Accounting, or All).
   - Priority Flag (`ด่วนที่สุด / Urgent`, `สำคัญ / High`, `ทั่วไป / Normal`).
   - Actionable description and Target Due Date.
2. **Execution & Replies**:
   - The recipient (e.g. Admin) receives the directive and can reply with progress notes.
   - Status transitions dynamically: `รอดำเนินการ (Pending)` ➔ `กำลังดำเนินการ (In Progress)` ➔ `เสร็จสิ้น (Completed)`.
3. **Persistence**: All directives, replies, and status logs survive browser refreshes via `localStorage`.

---

## 5. Master PIN Verification Flow (`1234`)
- When any user attempts to switch to the **CEO role**, the system presents a **Security PIN Dialog**.
- Entering `1234` verifies the user as the authenticated executive, unlocks full master capabilities, and displays the **👑 CEO Unlocked** badge in the header.
- Entering an incorrect PIN displays a validation warning and retains the user in their current role.
- Users can safely lock CEO access or switch back to other roles at any time.
