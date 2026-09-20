# PU Roof Works — Metal Sheet & PU Foam Roof Manufacturing Executive Decision Hub
> **ศูนย์บริหารจัดการและสนับสนุนการตัดสินใจเชิงกลยุทธ์ โรงงานผลิตหลังคาเหล็กเมทัลชีทและบุฉนวนพียูโฟม**  
> ขับเคลื่อนด้วยข้อมูลจาก 3 ไฟล์ CSV ของโปรแกรมบัญชี Express (ขายเงินสด, ใบกำกับสินค้า/ขายเชื่อ, ใบรับมัดจำ)

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
4. **Role-Based Access Control (RBAC) & CEO Governance**:
   - **CEO (คุณชาเอม)**: Protected with PIN **`1234`**, 100% master permissions across all 8 modules, executive override authority for quote margins, and a directive channel to Admin.
   - **Admin, Sales, Warehouse, Accounting**: Strict separation of duties — each department can only access and perform their authorized tasks.

---

## 2. Verification of Operational Formulas (การทดสอบสูตร)

All 5 core operational formulas have been verified against hand-calculated benchmarks:
1. **Run Rate**: `runRate(500000, 10, 22) = 1,100,000 THB` [PASSED ✅]
2. **Zero Sales Guard**: Safely computes 0 without crashing [PASSED ✅]
3. **Push List Trigger**: Days of Cover > 90 days triggers aged stock alerts [PASSED ✅]
4. **Reorder Point (ROP)**: `(average_daily_usage * lead_time) + safety_stock` [PASSED ✅]
5. **Gross Margin Guardrail**: Warns when Gross Margin < 20%; requires CEO PIN `1234` override [PASSED ✅]

---

## 3. Getting Started

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
