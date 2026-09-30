# PU Roof Works — Metal Sheet & PU Foam Roof Manufacturing Executive Decision Hub
> **ศูนย์บริหารจัดการและสนับสนุนการตัดสินใจเชิงกลยุทธ์ โรงงานผลิตหลังคาเหล็กเมทัลชีทและบุฉนวนพียูโฟม**  
> ขับเคลื่อนด้วยข้อมูลจาก 3 ไฟล์ CSV ของโปรแกรมบัญชี Express (ขายเงินสด, ใบกำกับสินค้า/ขายเชื่อ, ใบรับมัดจำ)  
> 🌐 **Live Web Application**: [https://pu-roof-works-dashbaord-nathawat48.ai.studio](https://pu-roof-works-dashbaord-nathawat48.ai.studio)

---

## 🇹🇭 เอกสารภาษาไทย (Thai Documentation Available)
โครงการนี้มีเอกสารประกอบฉบับภาษาไทยครบถ้วนทั้ง 7 ฉบับสำหรับทีมงาน ผู้บริหาร และนักพัฒนา:
- [📘 README ภาษาไทย (README-TH.md)](./README-TH.md)
- [🛡️ สิทธิ์การใช้งานระบบ RBAC & ระบบสั่งการ CEO (rbac.md)](./rbac.md)
- [📋 เอกสารข้อกำหนดผลิตภัณฑ์ PRD ภาษาไทย (prd-th.md)](./prd-th.md)
- [⚙️ กฎเหล็กและคำสั่งถาวรสำหรับ AI (AGENTS.md)](./AGENTS.md)
- [🏗️ สถาปัตยกรรมระบบและการประมวลผลข้อมูล (architecture-th.md)](./architecture-th.md)
- [🗄️ แบบจำลองโครงสร้างข้อมูล 3 ตาราง (schema-th.md)](./schema-th.md)
- [🚀 แผนงานและขั้นตอนการพัฒนา M0-M9 (implementation-plan-th.md)](./implementation-plan-th.md)
- [🧪 บันทึกความคืบหน้าและการทดสอบสูตร (progress-th.md)](./progress-th.md)

---

## 1. Executive Summary & Overview (ภาพรวมโครงการ)

**PU Roof Works Decision Hub** is a bilingual (Thai 🇹🇭 / English 🇬🇧) executive and operational decision-support dashboard engineered specifically for metal roofing and polyurethane (PU) foam manufacturers in Thailand.

### Key Capabilities
1. **Express 3-CSV File Ingestion**: Ingests, auto-detects, and validates 3 standard exports from Express Accounting Software:
   - `Cash Sales (CSV ขายเงินสด)`
   - `Credit Invoices / AR (CSV ใบกำกับสินค้า / ขายเชื่อ)`
   - `Deposit Receipts (CSV ใบรับมัดจำ)`
2. **Track A — Executive Run Rate & Forecast**: Computes elapsed working days, sales pace, seasonal weighting, and low/base/high monthly projections against a ฿2.5M target.
3. **Track B — Inventory & Quote Builder**: Calculates Days of Cover (DoC), Reorder Point (ROP), overstock push list (>90 days), and quotes with profit margin floor/ceiling guardrails.
4. **Production & Job Delivery Tracker (Shop Floor & Logistics)**:
   - 4-stage real-time manufacturing and dispatch pipeline: `รอรีดลอน (Roll Forming)` → `กำลังติด PU (Applying PU Foam)` → `พร้อมจัดส่ง (Ready to Ship)` → `จัดส่งเรียบร้อย (Delivered)`.
   - Real-time tracking of Job No., customer name, delivery site location, total length (meters), site contractor name, phone number, and scheduled dispatch date.
   - Operated primarily by the **Warehouse & Logistics Supervisor** with administrative oversight from **Admin** and **CEO**.
5. **Role-Based Access Control (RBAC) & CEO Governance**:
   - **CEO (คุณชาเอม)**: Protected with Master PIN **`1234`** (documented in GitHub repository specs), 100% master permissions across all 8 modules, executive override authority for quote margins, and a directive channel to Admin.
   - **Admin, Sales, Warehouse, Accounting**: Strict separation of duties — each department can only access and perform their authorized tasks.

---

## 2. Production Delivery: How It Works (ระบบงานผลิตและจัดส่ง)

The **Job Delivery Tracker** (`Truck / คิวงานผลิตและจัดส่ง`) synchronizes metal sheet roll-forming shop floor operations with daily site dispatch logistics:

### Pipeline Stages
1. **1. รอรีดลอน (Roll Forming Pending)**:
   - Raw material inspection: Galvanized and pre-painted steel coil mounted onto the de-coiler machine.
   - Machine tooling calibrated for ordered profile (e.g. ลอน 760, ลอนสเปน, ลอนฝ้า).
2. **2. กำลังติด PU (Applying PU Foam / Polyurethane Lamination)**:
   - In-line chemical foaming unit injects continuous rigid polyurethane foam (1-inch or 2-inch thickness).
   - Protective aluminium foil or PVC backing laminated under automated heat and density sensors.
3. **3. พร้อมจัดส่ง (Ready to Ship / Staging & Loading)**:
   - Sheets sheared to order specifications (e.g., 6.00m, 8.50m, 12.00m).
   - Bundles tagged with Job Number labels, passed through Quality Control (QC), and loaded onto 6-wheel or 10-wheel transport trucks.
4. **4. จัดส่งเรียบร้อย (Delivered / Signed Handover)**:
   - Dispatched to construction site address.
   - Received and inspected by the contractor/installer, delivery manifest signed, and order status finalized in the system.

### Interactive Features
- **Pipeline Metric Cards**: Instant count of active trucks/jobs per stage with single-click status filtering.
- **Stage Progression**: Select dropdown on any job card to instantly update its status.
- **Site Coordination**: Quick access to destination address, foreman phone call links, and total meters produced.

---

## 2. Verification of Operational Formulas (การทดสอบสูตร)

All 5 core operational formulas have been verified against hand-calculated benchmarks:
1. **Run Rate**: `runRate(500000, 10, 22) = 1,100,000 THB` [PASSED ✅]
2. **Zero Sales Guard**: Safely computes 0 without crashing [PASSED ✅]
3. **Push List Trigger**: Days of Cover > 90 days triggers aged stock alerts [PASSED ✅]
4. **Reorder Point (ROP)**: `(average_daily_usage * lead_time) + safety_stock` [PASSED ✅]
5. **Gross Margin Guardrail**: Warns when Gross Margin < 20%; requires CEO PIN `1234` override [PASSED ✅]

---

## 3. 1-Click Launchers & Shortcuts (ทางลัดเปิดใช้งานทันที)

You can launch and open the application instantly without using the terminal by double-clicking the launcher files included in the project root:

| File | Operating System | Action |
| :--- | :--- | :--- |
| **`OPEN_APP.html`** | Windows, Mac, Linux, Tablet | Universal launcher portal; opens in any web browser with 1-click cloud & localhost options |
| **`OPEN_APP.url`** | Windows | Internet Shortcut; immediately opens the live web app in your default browser |
| **`START_APP.bat`** | Windows | Batch script; starts the local Node.js server and launches the browser automatically |
| **`START_APP.command`** | macOS / Linux | Executable script; starts the local server and opens your default browser |

---

## 4. Getting Started

### Development Mode
\`\`\`bash
npm install
npm run dev
\`\`\`
The application starts at `http://localhost:3000`.

### Type Checking & Linting
\`\`\`bash
npm run lint
\`\`\`

### Production Build
\`\`\`bash
npm run build
\`\`\`
Outputs static bundle in `dist/`.
