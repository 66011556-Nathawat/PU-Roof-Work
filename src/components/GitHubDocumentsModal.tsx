import React, { useState } from 'react';
import { X, FileText, Copy, Check, Download, GitBranch, Terminal, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface GitHubDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDocumentsModal: React.FC<GitHubDocumentsModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  // Modal-specific document language toggle (defaults to global app language)
  const [docLang, setDocLang] = useState<'th' | 'en'>(() => (lang === 'en' ? 'en' : 'th'));
  const [activeDoc, setActiveDoc] = useState<string>('rbac');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const docsTh: Record<string, { title: string; filename: string; label: string; content: string }> = {
    rbac: {
      title: '1. rbac.md (ผังสิทธิ์การใช้งาน RBAC & ระบบสั่งการ CEO)',
      filename: 'rbac.md',
      label: '1. rbac.md (ผังสิทธิ์)',
      content: `# ผังสิทธิ์การใช้งานระบบ (RBAC) และการกำกับดูแลของผู้บริหาร
**PU Roof Works — ศูนย์บริหารและตัดสินใจสำหรับโรงงานผลิตหลังคาเหล็กเมทัลชีทและพียูโฟม**

เอกสารฉบับนี้กำหนดสิทธิ์การเข้าถึง ขอบเขตหน้าที่ และมาตรการความปลอดภัยของแต่ละบทบาทในระบบอย่างเข้มงวด

---

## 1. บทสรุปผู้บริหารและโมเดลความปลอดภัย (Security Model)

ระบบใช้หลักการ **การแบ่งแยกหน้าที่ตามความรับผิดชอบ (Separation of Concerns - SoC)** สอดคล้องกับโรงงานอุตสาหกรรมในไทย:
- **CEO (ผู้บริหารสูงสุด)**: ปลดล็อกด้วยรหัสผ่าน **\`1234\`** ได้รับสิทธิ์สูงสุด 100% ทุกระบบ สามารถออก **ข้อสั่งการและโน้ตกำชับ (CEO Directives)** ถึงผู้ดูแลระบบ (Admin) และทุกฝ่ายงาน สามารถอนุมัติราคาพิเศษเมื่อกำไรต่ำกว่าเกณฑ์ (Margin Floor Override) และล้าง/รีเซ็ตฐานข้อมูลได้
- **Admin (ผู้ดูแลระบบ)**: ควบคุมดูแลการนำเข้า 3 ไฟล์ CSV จากโปรแกรมบัญชี Express, ตรวจสอบความถูกต้องของข้อมูล, และรายงานความคืบหน้าตอบกลับข้อสั่งการของ CEO
- **บทบาทเฉพาะทาง (ฝ่ายขาย, คลังสินค้า, บัญชีและการเงิน)**: **ทำเฉพาะหน้าที่ของตนเอง (Role Specific)** ไม่สามารถก้าวก่ายงานฝ่ายอื่น เช่น ฝ่ายขายไม่สามารถแก้คิวผลิต, ฝ่ายคลังไม่สามารถดูตัวเลขกำไรของบริษัท, ฝ่ายบัญชีไม่สามารถลบฐานข้อมูลได้

---

## 2. ตารางผังสิทธิ์บทบาทการใช้งาน (Role Permission Matrix)

| ฟังก์ชันงาน / ระบบ (Capability) | CEO (ผู้บริหาร) 👑 | Admin (ผู้ดูแล) 🛡️ | Sales (ฝ่ายขาย) 💼 | Warehouse (คลัง/ผลิต) 📦 | Accounting (บัญชี/การเงิน) 💰 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **รหัสผ่านยืนยันสิทธิ์ (Master PIN)** | **1234** | - | - | - | - |
| **ภาพรวมบริษัท (Executive Overview & P&L)** | ✅ เต็มรูปแบบ | ✅ ดูได้ | 🟡 ยอดขายรวม | ❌ ปิดกั้นสิทธิ์ | 🟡 บัญชี & AR |
| **การนำเข้า 3 ไฟล์ Express CSV** | ✅ ทำได้ | ✅ ทำได้ | ❌ เฉพาะดูตัวอย่าง | ❌ ปิดกั้นสิทธิ์ | ✅ ทำได้ (ขายเชื่อ/มัดจำ) |
| **ล้างฐานข้อมูลระบบทั้งหมด (Clear All Data)** | ✅ ทำได้ (PIN 1234) | 🟡 ยืนยันสิทธิ์ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **รีเซ็ตข้อมูลตัวอย่าง (Reset Sample Data)** | ✅ ทำได้ | ✅ ทำได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **ออกข้อสั่งการ/โน้ตถึง Admin (CEO Directives)** | ✅ สั่งการได้ | 💬 ตอบกลับ/อัปเดต | 💬 ตอบกลับ | 💬 ตอบกลับ | 💬 ตอบกลับ |
| **ตอบกลับคอมเมนต์และอัปเดตสถานะงาน** | ✅ ทำได้ | ✅ ทำได้ | ✅ เฉพาะงานฝ่ายขาย | ✅ เฉพาะงานฝ่ายคลัง | ✅ เฉพาะงานฝ่ายบัญชี |
| **สร้างใบเสนอราคา (Track B Quote Assistant)** | ✅ ทำได้ | ✅ ทำได้ | ✅ ฟังก์ชันหลัก | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **อนุมัติส่วนลดต่ำกว่าเกณฑ์กำไร (Floor < 18%)** | ✅ **CEO Override** | ❌ ต้องขออนุมัติ | ❌ ต้องขออนุมัติ | ❌ ทำไม่ได้ | ❌ ทำไม่ได้ |
| **ตรวจสอบสต็อก & จุดสั่งซื้อ (Days of Cover/ROP)** | ✅ ดูได้ | ✅ ดูได้ | 🟡 ดูจำนวนคงเหลือ | ✅ **ฟังก์ชันหลัก** | 🟡 ดูมูลค่าสต็อก |
| **อัปเดตสถานะคิวงานผลิต/จัดส่ง (Delivery Tracker)** | ✅ อัปเดตได้ | ✅ อัปเดตได้ | ❌ เฉพาะดูวันส่งมอบ | ✅ **ฟังก์ชันหลัก** | ❌ เฉพาะดูวันส่งมอบ |
| **บริหารลูกหนี้ขายเชื่อ (Credit Invoices & AR)** | ✅ ดูได้ทั้งหมด | ✅ ดูได้ | 🟡 ดูยอดลูกค้าตนเอง | ❌ ปิดกั้นสิทธิ์ | ✅ **ฟังก์ชันหลัก** |
| **จัดการและตัดยอดใบรับมัดจำ (Deposit Receipts)** | ✅ ดูได้ทั้งหมด | ✅ ดูได้ | 🟡 ดูยอดมัดจำที่ผูก | ❌ ปิดกั้นสิทธิ์ | ✅ **ฟังก์ชันหลัก** |

*สัญลักษณ์: ✅ = ทำได้เต็มสิทธิ์, 🟡 = ดูได้เฉพาะส่วนที่เกี่ยวข้อง, ❌ = ปิดกั้นการเข้าถึง, 💬 = ตอบกลับข้อสั่งการได้*

---

## 3. รายละเอียดสิทธิ์รายบุคคล (Detailed Breakdown)

### 3.1 Chief Executive Officer (CEO / ผู้บริหารสูงสุด)
- **ผู้รับผิดชอบ**: คุณชาเอม (CEO)
- **รหัสผ่านยืนยันตัวตน**: **PIN \`1234\`**
- **สิ่งที่ทำได้ (CAN DO)**:
  1. สิทธิ์สมบูรณ์ 100% เข้าถึงและแก้ไขได้ทุกโมดูลทั้ง 8 หน้า
  2. ออกข้อสั่งการ บันทึกช่วยจำ มอบหมายงาน และตั้งระดับความเร่งด่วน (ด่วนที่สุด, สำคัญสูง, ปกติ) ถึง Admin และฝ่ายงาน
  3. อนุมัติส่วนลดพิเศษกรณี Margin ต่ำกว่าเกณฑ์ความปลอดภัย 20% (CEO Margin Floor Override)
  4. ดำเนินการระดับระบบ: ล้างฐานข้อมูลทั้งหมด หรือรีเซ็ตเป็นข้อมูลตัวอย่างอุตสาหกรรม
  5. ดูรายงานคาดการณ์ยอดขาย Track A (Run Rate, ตัวคูณฤดูกาล, ช่วงความเชื่อมั่น Low/Base/High)
- **สิ่งที่ทำไม่ได้ (CANNOT DO)**: ไม่มี (Super-User เต็มรูปแบบ)

### 3.2 System Administrator (Admin / ผู้ดูแลระบบ)
- **สิ่งที่ทำได้**: นำเข้าไฟล์ Express 3 CSV, ตรวจสอบโครงสร้างไฟล์, ตอบกลับและอัปเดตสถานะข้อสั่งการของ CEO, รีเซ็ตข้อมูลระบบ
- **สิ่งที่ทำไม่ได้**: ไม่สามารถออกข้อสั่งการ CEO และไม่สามารถอนุมัติส่วนลดราคาต่ำกว่า Floor ด้วยตนเอง

### 3.3 Sales Manager (ผู้จัดการฝ่ายขาย)
- **สิ่งที่ทำได้**: ใช้ระบบคำนวณราคาและออกใบเสนอราคา (Track B), ติดตามยอดขายเงินสด, ตรวจสอบสต็อกคงเหลือสำหรับเสนอราคา, ดูรายการลูกหนี้ของลูกค้าตนเอง
- **สิ่งที่ทำไม่ได้**: ไม่สามารถลบฐานข้อมูล, ไม่สามารถแก้วันคิวผลิตของโรงงาน, ไม่สามารถตัดยอดเงินมัดจำในระบบบัญชี

### 3.4 Warehouse & Logistics Supervisor (ฝ่ายคลังและจัดส่ง)
- **สิ่งที่ทำได้**: ตรวจสอบวันครอบคลุมสต็อก (Days of Cover), จุดสั่งซื้อซ้ำ (ROP), รายการเร่งระบายสต็อก (>90 วัน), อัปเดต 4 สถานะคิวงานผลิต (รอรีดลอน -> กำลังติด PU -> พร้อมจัดส่ง -> จัดส่งเรียบร้อย)
- **สิ่งที่ทำไม่ได้**: ไม่สามารถดูต้นทุนกำไรของฝ่ายบริหาร, ไม่สามารถดูยอดลูกหนี้ค้างชำระของลูกค้า

### 3.5 Accounting & Finance (ฝ่ายบัญชีและการเงิน)
- **สิ่งที่ทำได้**: ตรวจสอบยอดขายสด, จัดการอายุหนี้การค้า (0-30, 31-60, 61-90, 90+ วัน), บริหารและตัดยอดใบรับมัดจำค่าผลิตหลังคา
- **สิ่งที่ทำไม่ได้**: ไม่สามารถแก้ไขคิวงานผลิตหน้าโรงงาน และไม่สามารถล้างฐานข้อมูลระบบทั้งหมด`,
    },
    prd: {
      title: '2. prd.md (เอกสารข้อกำหนดผลิตภัณฑ์ PRD)',
      filename: 'prd.md',
      label: '2. prd.md (สเปกโครงการ)',
      content: `# เอกสารข้อกำหนดผลิตภัณฑ์ (Product Requirements Document - PRD)
**ระบบบริหารและตัดสินใจสำหรับโรงงานผลิตหลังคาเมทัลชีทและพียูโฟม (PU Roof Works)**

## 1. วัตถุประสงค์ของระบบ (What)
แพลตฟอร์มสนับสนุนการตัดสินใจเชิงกลยุทธ์และการปฏิบัติงานรายวันสำหรับ **PU Roof Works** (ผู้ผลิตและจัดจำหน่ายแผ่นหลังคาเหล็กเมทัลชีท ฉนวนกันความร้อนพียูโฟม และอุปกรณ์ติดตั้ง)
ระบบเชื่อมโยงข้อมูลจาก **3 ไฟล์ CSV มาตรฐานของโปรแกรมบัญชี Express**:
1. **CSV ขายเงินสด (Cash Sales)**: ยอดขายหน้าร้าน ลูกค้าช่างทั่วไป
2. **CSV ใบกำกับสินค้า / ขายเชื่อ (Credit Invoices & AR)**: ยอดขายโครงการและช่างรับเหมาประจำ
3. **CSV ใบรับมัดจำ (Deposit Receipts)**: เงินมัดจำค่าสั่งผลิตหลังคา PU ล่วงหน้า

## 2. ปัญหาและความจำเป็น (Why)
- **การคาดการณ์ยอดขายระหว่างเดือน (Track A)**: ผู้บริหารต้องทราบว่าสิ้นเดือนยอดจะเข้าเป้า ฿2.5M หรือไม่ตั้งแต่กลางเดือน
- **การควบคุมความเสี่ยงหนี้สูญ (AR Aging)**: ต้องจำแนกช่วงอายุหนี้ 0-30, 31-60, 61-90, 90+ วัน เพื่อทวงถามก่อนเกินกำหนด
- **การบริหารสต็อกคอยล์และสารเคมี PU (Track B)**: คำนวณวันครอบคลุมสต็อก (DoC) และแจ้งเตือนจุดสั่งซื้อซ้ำ (ROP) รวมถึงผลักดันสต็อกค้างเกิน 90 วัน
- **การออกใบเสนอราคาอย่างปลอดภัย (Quote Guardrails)**: มีเกณฑ์ขั้นต่ำ (Floor 20%) เพื่อรักษาผลกำไรของโรงงาน

## 3. กลุ่มผู้ใช้งาน (Who - User Personas)
- **ผู้บริหาร (CEO)**: ต้องการเห็นชีพจรธุรกิจ ความเร็วการขาย (Pace) สภาพคล่อง และออกคำสั่งการด่วน
- **ผู้ดูแลระบบ (Admin)**: นำเข้าไฟล์ Express 3 ไฟล์ จัดการความสมบูรณ์ของฐานข้อมูล
- **ฝ่ายขาย (Sales)**: เสนอราคาที่แข่งขันได้ ติดตามยอดขายเงินสด
- **ฝ่ายคลังและผลิต (Warehouse)**: ตรวจสอบวัตถุดิบและจัดส่งตามกำหนด
- **ฝ่ายบัญชี (Accounting)**: ควบคุมลูกหนี้และกระทบยอดเงินมัดจำ

## 4. คุณสมบัติหลัก 8 โมดูล (Core Features)
1. **การนำเข้า 3 ไฟล์ CSV**: มีพื้นที่ลากวาง (Drag & Drop) และระบบตรวจจับประเภทไฟล์อัตโนมัติ พร้อมปุ่มโหลดข้อมูลตัวอย่างจริง
2. **ภาพรวมผู้บริหาร (Executive Overview & Track A Forecast)**: แสดงยอดขายสะสม (MTD), ความเร็วการขาย, ตัวคูณฤดูกาล, คาดการณ์ Low/Base/High
3. **สุขภาพคลังสินค้า (Stock Health & Track B)**: ตรวจสอบ Days of Cover, ROP, และรายการ Push List
4. **ระบบคำนวณราคา (Quote Builder)**: คำนวณต้นทุนวัตถุดิบ + ค่าแรงช่างปรับตัวคูณการใช้งาน (Utilisation 70%) พร้อมระบบ CEO Override
5. **คิวงานผลิตและจัดส่ง (Job Delivery Tracker)**: ติดตามสถานะคำสั่งผลิต 4 ขั้นตอน
6. **ขายเชื่อและลูกหนี้ (Credit Sales & AR Aging)**: รายงานอายุหนี้และจัดลำดับความเร่งด่วนในการติดตามหนี้
7. **ทะเบียนใบรับมัดจำ (Deposit Receipts)**: ติดตามยอดคงเหลือและการตัดใช้กับใบกำกับ
8. **ระบบสิทธิ์ RBAC & CEO Directives**: รหัสผ่าน CEO \`1234\`, การสั่งการและตอบกลับแบบมีเธรดคอมเมนต์`,
    },
    agents: {
      title: '3. AGENTS.md (ข้อกำหนดและคำสั่งถาวรสำหรับ AI)',
      filename: 'AGENTS.md',
      label: '3. AGENTS.md (คำสั่ง AI)',
      content: `# ข้อกำหนดและระเบียบปฏิบัติถาวรสำหรับ AI (AGENTS.md)
**PU Roof Works — Metal Sheet & PU Foam Manufacturing Decision Hub**

## บริบทโครงการ (Project Context)
แดชบอร์ดสนับสนุนการตัดสินใจระดับบริหารสำหรับโรงงานผลิตหลังคาเมทัลชีทและพียูโฟมในประเทศไทย ขับเคลื่อนด้วยข้อมูลจาก 3 ไฟล์ CSV ของโปรแกรมบัญชี Express (ขายสด, ใบกำกับขายเชื่อ, ใบรับมัดจำ)

## กฎเหล็กที่ต้องปฏิบัติตามอย่างเคร่งครัด (Hard Rules)
1. **การบังคับใช้สิทธิ์บทบาท (RBAC Enforcement)**:
   - CEO มีสิทธิ์ทำได้ทุกอย่าง 100% ต้องใช้รหัสยืนยันตัวตน \`1234\` สามารถสั่งการและคอมเมนต์ถึง Admin ได้
   - แต่ละฝ่าย (ฝ่ายขาย, คลังสินค้า, บัญชี) ทำเฉพาะหน้าที่ของตนเอง ห้ามก้าวก่ายข้ามฝ่าย
2. **ความถูกต้องของสูตรคำนวณทางคณิตศาสตร์**:
   - สูตร Track A: Run Rate = (ยอดสะสม / วันทำงานที่ผ่านไป) * วันทำงานทั้งเดือน * ตัวคูณฤดูกาล (Seasonal Multiplier)
   - สูตร Track B: Days of Cover = สต็อกคงเหลือ / ยอดใช้เฉลี่ยต่อวัน, Reorder Point = (ยอดใช้เฉลี่ย * Lead Time) + Safety Stock
   - เกณฑ์ควบคุมราคา: Floor Margin ขั้นต่ำ 20% (เว้นแต่ CEO อนุมัติด้วยรหัส 1234)
3. **ห้ามมีปุ่มหลอกหรือฟังก์ชันที่ไม่ตอบสนอง (No Broken Buttons)**:
   - ทุกปุ่มในระบบ (อัปโหลด, โหลดตัวอย่าง, คำนวณราคา, กรองข้อมูล, ส่งออก CSV, สั่งการ CEO, สลับบทบาท) ต้องทำงานได้สมบูรณ์จริง
4. **ความสมจริงของข้อมูลจำลองอุตสาหกรรมไทย**:
   - ใช้รหัสสินค้าและสเปกหลังคาจริง: ลอน 760, ฉนวนพียู 1-2 นิ้ว, แผ่นใสไฟเบอร์กลาส, ครอบจั่ว, สกรูยึดแปเหล็ก
5. **การคงอยู่ของข้อมูล (Instant LocalStorage Persistence)**:
   - ทุกการอัปโหลด แก้ไขข้อมูล หรือข้อสั่งการ ต้องบันทึกลงใน localStorage ทันที เพื่อให้คงอยู่เมื่อผู้ใช้รีเฟรชเบราว์เซอร์`,
    },
    architecture: {
      title: '4. architecture.md (สถาปัตยกรรมระบบและการประมวลผลข้อมูล)',
      filename: 'architecture.md',
      label: '4. architecture.md (สถาปัตยกรรม)',
      content: `# สถาปัตยกรรมระบบและการประมวลผลข้อมูล (System Architecture)
**PU Roof Works Operations & Express Hub**

## 1. แผนภาพการไหลของข้อมูล (Data Flow Architecture)

\`\`\`
[โปรแกรมบัญชี Express Accounting]
       │ (ส่งออกไฟล์รายงาน)
       ▼
3 ไฟล์ CSV มาตรฐาน (ขายสด, ขายเชื่อ/ลูกหนี้, ใบรับมัดจำ)
       │
       ▼
[ตัวแปลงไฟล์ CSV (csvParser.ts)] <--- รองรับ UTF-8/TIS-620, เครื่องหมายจุลภาค, ตรวจจับประเภทไฟล์อัตโนมัติ
       │
       ▼
[ระบบจัดการสถานะข้อมูล (React State + LocalStorage)]
       │
       ├─► [โมเดลความปลอดภัย RBAC]: สิทธิ์ CEO (รหัส 1234), Admin, และการแยกสิทธิ์รายบทบาท
       ├─► [ช่องทางสั่งการ CEO]: ข้อสั่งการจากผู้บริหาร พร้อมระบบเธรดโต้ตอบกับ Admin
       ├─► [เครื่องมือคำนวณ Track A]: Run Rate, ตัวคูณฤดูกาล, ช่วงคาดการณ์ยอดขาย
       ├─► [เครื่องมือคำนวณ Track B]: Days of Cover, Reorder Point, Price Guardrails
       └─► [ระบบภาษาและธีม]: LanguageContext (ไทย/อังกฤษ), ThemeContext (Light/Black)
       │
       ▼
[หน้าจอแดชบอร์ดและโมดูลการทำงาน]
       ├─ 1. ข้อมูลและการนำเข้า (Data Ingestion & 3 CSV Import)
       ├─ 2. ภาพรวมบริษัท (Executive CEO Overview)
       ├─ 3. สินค้าขายดี / ค้างสต็อก (Stock Health & Push List)
       ├─ 4. ติดตามงานและจัดส่ง (Production & Delivery Tracker)
       ├─ 5. ลูกค้าและช่าง (Customer & Contractor Accounts)
       ├─ 6. ขายเชื่อและลูกหนี้ (Credit Sales & AR Aging)
       ├─ 7. ใบรับมัดจำ (Deposit Receipts Ledger)
       └─ 8. ข้อเสนอแนะอัตโนมัติ (AI Action Engine)
\`\`\`

## 2. โครงสร้างเลเยอร์ของระบบ (System Layers)
- **UI & Interaction Layer**: สร้างด้วย React 18, TypeScript, Tailwind CSS ปรับแต่งตามโทนสีอุตสาหกรรม
- **State & Domain Logic Layer**: แยกการคำนวณทางคณิตศาสตร์ทั้งหมดใน \`/src/utils/calculations.ts\` เพื่อความโปร่งใสและทดสอบได้ง่าย
- **Security & Authorization Layer**: \`/src/data/rolePermissions.ts\` กำหนดสิทธิ์และความสามารถของทั้ง 5 บทบาท`,
    },
    schema: {
      title: '5. schema.md (แบบจำลองโครงสร้างข้อมูล Express CSV)',
      filename: 'schema.md',
      label: '5. schema.md (โครงสร้างข้อมูล)',
      content: `# แบบจำลองโครงสร้างข้อมูล (Data Schema: Express CSV Models)

## ตารางที่ 1: รายการขายเงินสด (cash_sales / CSV ขายเงินสด)
- \`doc_no\` (PK string): เลขที่เอกสาร เช่น "CS6709-0012"
- \`date\` (string): วันที่เกิดรายการ เช่น "2026-09-02"
- \`customer_name\` (string): ชื่อลูกค้า / ช่าง เช่น "ช่างเกรียงศักดิ์ สุพรรณ"
- \`branch\` (string): สาขา เช่น "สาขาใหญ่"
- \`sku\` (string): รหัสสินค้า เช่น "PU-760-035-BL"
- \`product_name\` (string): ชื่อสินค้า เช่น "หลังคาเมทัลชีท ลอน 760 บุพียูโฟม 1 นิ้ว"
- \`quantity\` (number): จำนวน (เมตร/หน่วย) เช่น 120
- \`total_amount\` (number): ยอดเงินรวม เช่น 33700.00

## ตารางที่ 2: ใบกำกับสินค้า / ขายเชื่อ (credit_invoices / CSV ขายเชื่อ)
- \`invoice_no\` (PK string): เลขที่ใบกำกับ เช่น "IV6708-0112"
- \`date\` (string): วันที่ออกใบกำกับ เช่น "2026-08-05"
- \`due_date\` (string): วันครบกำหนดชำระ เช่น "2026-09-04"
- \`customer_name\` (string): ชื่อบริษัท / ลูกค้า เช่น "บจก. สยามพาณิชย์ คอนสตรัคชั่น"
- \`grand_total\` (number): ยอดเงินตามบิล เช่น 262150.00
- \`paid_amount\` (number): ยอดเงินที่ชำระแล้ว เช่น 100000.00
- \`outstanding_balance\` (number): ยอดหนี้คงค้าง เช่น 162150.00
- \`status\` (string): สถานะอายุหนี้ เช่น "เกินกำหนด 1-30 วัน"

## ตารางที่ 3: ใบรับมัดจำ (deposit_receipts / CSV ใบรับมัดจำ)
- \`deposit_no\` (PK string): เลขที่ใบรับมัดจำ เช่น "DP6709-0008"
- \`date\` (string): วันที่รับเงินมัดจำ เช่น "2026-09-04"
- \`customer_name\` (string): ชื่อลูกค้า เช่น "บมจ. เจริญกิจ โลจิสติกส์ พาร์ค"
- \`deposit_amount\` (number): จำนวนเงินมัดจำรับ เช่น 150000.00
- \`remaining_amount\` (number): เงินมัดจำคงเหลือที่ยังไม่ได้ตัดบิล เช่น 150000.00

## ตารางที่ 4: ข้อสั่งการผู้บริหารและการตอบกลับ (ceo_directives)
- \`id\` (PK string): รหัสข้อสั่งการ เช่น "dir-1"
- \`title\` (string): หัวข้อสั่งการ เช่น "ตรวจสอบความถูกต้องของไฟล์ Express 3 CSV"
- \`target_role\` (string): บทบาทผู้รับผิดชอบ ("admin" | "sales" | "warehouse" | "accounting" | "all")
- \`priority\` (string): ระดับความเร่งด่วน ("urgent" | "high" | "normal")
- \`content\` (string): รายละเอียดคำสั่งจาก CEO
- \`status\` (string): สถานะ ("pending" | "in_progress" | "completed")
- \`comments\` (array): ข้อความสนทนาตอบกลับระหว่าง Admin และหัวหน้าฝ่าย`,
    },
    plan: {
      title: '6. implementation-plan.md (แผนงานพัฒนา M0 - M9)',
      filename: 'implementation-plan.md',
      label: '6. plan.md (แผนพัฒนา)',
      content: `# แผนงานและขั้นตอนการพัฒนา (Implementation Plan: M0 ถึง M9)

- [x] **M0: โครงสร้างพื้นฐาน (Scaffold)** — วางเลเยอร์หน้าจอ, เมนูแถบข้าง, ส่วนหัว, โครงสี Tailwind และการเปลี่ยนธีม
- [x] **M1: ข้อมูลและตัวอย่างจริง (Data + Seed)** — ชุดข้อมูลโรงงานหลังคาเมทัลชีทและพียูโฟมในไทยที่สมจริง (ขายสด, ใบกำกับ, มัดจำ, สต็อก, คิวงาน)
- [x] **M2: การคำนวณทางคณิตศาสตร์ (Core Calculation)** — สูตร Track A Run Rate & Forecast, สูตร Track B Days of Cover, ROP, และ Guardrails
- [x] **M3: หน้าจอตัดสินใจของผู้บริหาร (Decision View)** — รายงานสรุป CEO, สัญญาณเตือนความเร็วเทียบเป้าหมาย, วิเคราะห์อายุหนี้ AR
- [x] **M4: การนำเข้า 3 ไฟล์ CSV (Input & Edit)** — ช่องนำเข้า 3 ช่องพร้อมระบบลากวางและตรวจจับประเภทไฟล์อัตโนมัติ
- [x] **M5: การบันทึกและส่งออกข้อมูล (Persistence + Export)** — ซิงค์ข้อมูลลง localStorage ทันที และส่งออกไฟล์ CSV รวม
- [x] **M6: ความประณีตของส่วนติดต่อผู้ใช้ (Polish & Responsive)** — ออกแบบตรงตามรูปตัวอย่าง preview.webp พร้อมรองรับการแสดงผลทุกขนาดหน้าจอ
- [x] **M7: ระบบคำนวณราคาและคลังเอกสาร (Hardening)** — ระบบ Quote Builder คำนวณค่าแรงและมาร์กอัป พร้อมระบบเปิดดูเอกสาร Markdown 7 ฉบับ
- [x] **M8: รองรับ 2 ภาษาและ 2 ธีม (Bilingual & Dual Theme)** — สลับภาษาไทย 🇹🇭 / ภาษาอังกฤษ 🇬🇧 และสลับธีม สว่าง (Light) / ดำ (Black)
- [x] **M9: ระบบสิทธิ์บทบาทและการกำกับดูแลของผู้บริหาร (RBAC & Governance)**:
  - ยืนยันสิทธิ์ CEO ด้วยรหัสผ่านพิเศษ \`1234\`
  - การจำกัดสิทธิ์แต่ละฝ่าย (Sales, Warehouse, Accounting ทำเฉพาะหน้าที่)
  - ระบบข้อสั่งการและโน้ตกำชับ (CEO Directives to Admin) พร้อมเธรดโต้ตอบ
  - ผังสิทธิ์บทบาทและเอกสาร rbac.md ครบถ้วน`,
    },
    progress: {
      title: '7. progress.md (บันทึกความคืบหน้าและการทดสอบสูตร)',
      filename: 'progress.md',
      label: '7. progress.md (บันทึกทดสอบ)',
      content: `# บันทึกความคืบหน้าและการทดสอบสูตร (Progress Log & Verified Formulas)

## สถานะปัจจุบันของโครงการ
- **สถานะไมล์สโตน**: เสร็จสมบูรณ์และผ่านการทดสอบครบถ้วน (M0 - M9)
- **ระบบสิทธิ์และความปลอดภัย (RBAC)**:
  - CEO ปลดล็อกด้วยรหัสผ่าน PIN \`1234\` เข้าถึงได้ 100%
  - ระบบส่งข้อสั่งการของ CEO ถึง Admin พร้อมการตอบกลับแบบเรียลไทม์
  - การล็อกสิทธิ์ป้องกันการลบข้อมูลหรือแก้ไขส่วนที่ไม่อยู่ในหน้าที่

## ผลการทดสอบ 5 กรณีทดสอบสำคัญ (Hand-Verified Test Cases)
1. **สูตร Run Rate รายเดือน**:
   - runRate(500,000 บาท, 10 วันทำงาน, 22 วันทั้งเดือน) = 1,100,000 บาท [ผ่านเกณฑ์ ✅]
2. **กรณียอดขายเป็นศูนย์ (Zero Sales)**:
   - zeroSales forecast = 0 บาท ระบบคำนวณได้ถูกต้อง ไม่เกิดข้อผิดพลาด [ผ่านเกณฑ์ ✅]
3. **วันครอบคลุมสต็อก (Days of Cover)**:
   - Days of Cover > 90 วัน จะถูกจัดเข้ากลุ่มเร่งระบายสต็อก (Push List) อัตโนมัติ [ผ่านเกณฑ์ ✅]
4. **จุดสั่งซื้อซ้ำ (Reorder Point - ROP)**:
   - ROP = (ยอดใช้เฉลี่ยต่อวัน * ระยะเวลารอคอยสินค้า) + สต็อกปลอดภัย [ผ่านเกณฑ์ ✅]
5. **เกณฑ์ควบคุมอัตรากำไรขั้นต่ำ (Profit Margin Floor Guardrail)**:
   - กำไรต่ำกว่า 20% จะส่งสัญญาณเตือนสีแดง และต้องได้รับอนุมัติข้อยกเว้นจาก CEO (รหัส 1234) เท่านั้น [ผ่านเกณฑ์ ✅]

## สรุปการส่งมอบ
- ช่องนำเข้า 3 ไฟล์ Express CSV พร้อมตรวจสอบอัตโนมัติ
- แดชบอร์ดสรุปยอดขายเทียบเป้า 2.5 ล้านบาท และกราฟแนวโน้ม
- โมดูลบริหารสต็อกและระบบออกใบเสนอราคา Track B
- เอกสารภาษาไทยและอังกฤษครบถ้วนใน GitHub Documents Modal`,
    },
  };

  const docsEn: Record<string, { title: string; filename: string; label: string; content: string }> = {
    rbac: {
      title: '1. rbac.md (Role Permissions & CEO Governance)',
      filename: 'rbac.md',
      label: '1. rbac.md (RBAC)',
      content: `# Role-Based Access Control (RBAC) & Operational Governance
**PU Roof Works — Metal Sheet & PU Foam Manufacturing Decision Hub**

This document specifies the exact permissions, boundaries, and security model governing all user roles in the PU Roof Works platform.

---

## 1. Security & Separation of Concerns (SoC)
- **CEO (Executive)**: Master PIN \`1234\`. 100% unrestricted privileges. Can issue executive directives & notes to Admin and all departments, override quote profit margins, and wipe/reset databases.
- **Admin (System Administrator)**: Manages 3-CSV Express ingestion, data integrity, and responds/comments back to CEO directives.
- **Other Roles (Sales, Warehouse, Accounting)**: Strictly restricted to their specific domain. Cannot perform operations outside their functional mandate.

---

## 2. Capability Matrix

| Feature / Capability | CEO (1234) 👑 | Admin 🛡️ | Sales 💼 | Warehouse 📦 | Accounting 💰 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Master PIN Authentication | **1234** | - | - | - | - |
| Executive Overview & P&L | Full Access | View | Summary | Restricted | AR Focus |
| Express 3-CSV Import | Yes | Yes | Read-Only | Restricted | Credit & Deposits |
| Clear Entire Database | Yes (PIN 1234) | Restricted | No | No | No |
| Reset Sample Data | Yes | Yes | No | No | No |
| CEO Directives to Admin | Issue & Direct | Reply/Update | Reply | Reply | Reply |
| Reply to Directives | Yes | Yes | Yes | Yes | Yes |
| Build Quotes (Track B) | Yes | Yes | Primary Job | No | No |
| Margin Floor Override (<18%) | **CEO Override** | Request Approval | Request Approval | No | No |
| Stock Health & DoC/ROP | Full | Full | Availability | **Primary Job** | Inventory Value |
| Production/Delivery Queue | Update | Update | Read-Only | **Primary Job** | Read-Only |
| Credit Invoices & AR Aging | Full | Full | Client Debt | Restricted | **Primary Job** |
| Deposit Receipts Reconciliation | Full | Full | Linked Deposits | Restricted | **Primary Job** |

---

## 3. What Roles CAN and CANNOT Do
- **CEO**: CAN do everything. CAN write notes, directives, and comments to Admin. Protected by password \`1234\`.
- **Admin**: CAN import files, reconcile CSVs, reply to CEO directives. CANNOT issue CEO directives or override margin floors unilaterally.
- **Sales**: CAN quote, check cash sales, view contractors. CANNOT delete DB, alter factory status, or modify accounting deposits.
- **Warehouse**: CAN monitor coils/PU foam, update job delivery stages (รอรีดลอน -> กำลังติด PU -> พร้อมจัดส่ง -> จัดส่งเรียบร้อย). CANNOT view executive profit margins or access debtor AR ledgers.
- **Accounting**: CAN track overdue AR (0-30, 31-60, 61-90, 90+ days), manage deposit receipts. CANNOT modify factory production schedules or clear system data.`,
    },
    prd: {
      title: '2. prd.md (Product Requirements)',
      filename: 'prd.md',
      label: '2. prd.md (PRD)',
      content: `# PRD: PU Roof Works Company Operations & Express Hub

## What
An executive and operational decision-support dashboard built for **PU Roof Works** (Metal sheet and PU foam roof manufacturing). The system ingests 3 standard CSV files exported directly from Express Accounting Software:
1. **Cash Sales (CSV ขายเงินสด)**
2. **Invoices & Credit Sales (CSV ใบกำกับสินค้า / ขายเชื่อ)**
3. **Deposit Receipts (CSV ใบรับมัดจำ)**

## Role-Based Access Control (RBAC) & Governance
- **CEO (Executive)**: Master permissions across all modules. Protected by password **1234**. Can issue direct operational directives and notes to Admin.
- **Admin (System Administrator)**: Handles 3-CSV Express data sync and responds to CEO notes and directives.
- **Department Roles**: Sales Manager, Warehouse Supervisor, and Accounting & Finance can each do only their designated duties.

## Core Features
1. Express 3-CSV File Ingestion with auto-detection.
2. Executive Overview & Track A Sales Forecast (Run Rate, Seasonal Adjustment, Range Low/Base/High).
3. Inventory & Track B Stock Health (Days of cover, Reorder point, Push list > 90 days).
4. Credit Sales & AR Aging buckets (0-30, 31-60, 61-90, 90+ days).
5. Deposit Receipts ledger with applied status.
6. Role-Based Access Control (RBAC) with CEO password 1234 and CEO-to-Admin directives.
7. Bilingual interface (Thai & English) with Light and Black themes.
8. Smart automated recommendations for immediate action.`,
    },
    agents: {
      title: '3. AGENTS.md (Standing Orders)',
      filename: 'AGENTS.md',
      label: '3. AGENTS.md (Rules)',
      content: `# AGENTS.md — Standing Orders for AI

## Project Context
PU Roof Works Dashboard: Executive decision-support platform for metal sheet and PU foam roof manufacturing company in Thailand. Driven by 3 Express accounting CSV files: Cash Sales, Credit Invoices, and Deposit Receipts.

## Hard Rules
1. Role boundaries must be strictly enforced: CEO can do everything with password \`1234\`, can note/comment to admin; other roles can do only their respective jobs.
2. Never hide calculations inside arbitrary black boxes; mathematical formulas must match Track A & B specifications.
3. No broken buttons or silent click handlers. All actions (upload, sample data, quote calculation, filter, export, directives, role switch) must be completely interactive and functional.
4. Keep seed data realistic to genuine Thai industrial roofing manufacturing (e.g. ลอน 760, ฉนวนพียู 1-2 นิ้ว, แผ่นใส, ครอบจั่ว, สกรู).
5. Allow instant data persistence via localStorage so user edits, directives, and uploads survive browser refresh.`,
    },
    architecture: {
      title: '4. architecture.md (System Architecture)',
      filename: 'architecture.md',
      label: '4. architecture.md (Architecture)',
      content: `# Architecture: PU Roof Works Operations & Express Hub

## High-Level Data Flow
[Express Accounting Software]
       │  Export
       ▼
3 CSV Files (Cash Sales, Invoices/AR, Deposits)
       │
       ▼
[CSV Parser Engine (csvParser.ts)] <--- Handles commas, quotes, encoding, auto-detection
       │
       ▼
[State Manager (React State + LocalStorage)]
       │
       ├─► [RBAC Security Engine]: CEO Master (PIN 1234), Admin Responder, Role Isolation
       ├─► [CEO Directives Channel]: Executive Notes to Admin with Reply Threads
       ├─► [Track A Engine (calculations.ts)]: Run Rate, Seasonal Adjust, Forecast
       ├─► [Track B Engine (calculations.ts)]: Days of Cover, Reorder Point, Price Guardrails
       └─► [Theme & i18n Contexts (LanguageContext, ThemeContext)]
       │
       ▼
[Views / Dashboard Components]
       ├─ 1. ข้อมูลและการนำเข้า (Data & 3 CSV Import)
       ├─ 2. ภาพรวมบริษัท (Executive CEO Overview)
       ├─ 3. สินค้าขายดี / ค้างสต็อก (Stock Health & Push List)
       ├─ 4. ติดตามงานและจัดส่ง (Production & Delivery Tracker)
       ├─ 5. ลูกค้าและช่าง (Customer & Contractor Accounts)
       ├─ 6. ขายเชื่อและลูกหนี้ (Credit Sales & AR Aging)
       ├─ 7. ใบรับมัดจำ (Deposit Receipts Ledger)
       └─ 8. ข้อเสนอแนะอัตโนมัติ (AI Action Engine)`,
    },
    schema: {
      title: '5. schema.md (Data Model)',
      filename: 'schema.md',
      label: '5. schema.md (Schema)',
      content: `# Schema: Express CSV Data Models

## Table 1: Cash Sales (cash_sales / CSV ขายเงินสด)
- doc_no (PK string): "CS6709-0012"
- date (string): "2026-09-02"
- customer_name (string): "ช่างเกรียงศักดิ์ สุพรรณ"
- branch (string): "สาขาใหญ่"
- sku (string): "PU-760-035-BL"
- product_name (string): "หลังคาเมทัลชีท ลอน 760 บุพียูโฟม 1 นิ้ว"
- quantity (number): 120
- total_amount (number): 33700.00

## Table 2: Credit Invoices (credit_invoices / CSV ใบกำกับสินค้า / ขายเชื่อ)
- invoice_no (PK string): "IV6708-0112"
- date (string): "2026-08-05"
- due_date (string): "2026-09-04"
- customer_name (string): "บจก. สยามพาณิชย์ คอนสตรัคชั่น"
- grand_total (number): 262150.00
- paid_amount (number): 100000.00
- outstanding_balance (number): 162150.00
- status (string): "เกินกำหนด 1-30 วัน"

## Table 3: Deposit Receipts (deposit_receipts / CSV ใบรับมัดจำ)
- deposit_no (PK string): "DP6709-0008"
- date (string): "2026-09-04"
- customer_name (string): "บมจ. เจริญกิจ โลจิสติกส์ พาร์ค"
- deposit_amount (number): 150000.00
- remaining_amount (number): 150000.00

## Table 4: CEO Directives & Comments (ceo_directives)
- id (PK string): "dir-1"
- title (string): "ตรวจสอบความถูกต้องของไฟล์ Express 3 CSV"
- target_role (string): "admin" | "sales" | "warehouse" | "accounting" | "all"
- priority (string): "urgent" | "high" | "normal"
- content (string): Directive instructions from CEO
- status (string): "pending" | "in_progress" | "completed"
- comments (array): Threaded replies from Admin and department leads`,
    },
    plan: {
      title: '6. implementation-plan.md',
      filename: 'implementation-plan.md',
      label: '6. plan.md (Milestones)',
      content: `# Implementation Plan: M0 to M9

- [x] M0: Scaffold — Clean index.html, Tailwind layout, header, navigation shell, empty states.
- [x] M1: Data + Seed — Realistic Thai PU Roof Works dataset (Cash sales, Invoices, Deposits, Inventory, Jobs).
- [x] M2: Core Calculation — Track A run rate & forecast, Track B days of cover & guardrails.
- [x] M3: The Decision View — Executive CEO overview, Ahead/Behind pace signal, AR aging breakdown, inventory alerts.
- [x] M4: Input & Edit — 3 CSV upload slots with drag & drop, file type auto-detection.
- [x] M5: Persistence + Export — LocalStorage synchronization, consolidated CSV export.
- [x] M6: Polish & Responsive — Exact aesthetic match with preview.webp, dark slate executive interface.
- [x] M7: Hardening — Interactive Quote Builder with margin guardrails, GitHub document repository viewer modal.
- [x] M8: Bilingual (EN/TH) & Dual Theme (Light & Black).
- [x] M9: Role-Based Access Control (RBAC) & CEO Governance:
  - CEO Password \`1234\` verification dialog.
  - Role isolation (Sales, Warehouse, Accounting can do only their job).
  - Executive Directives & Notes channel between CEO and Admin/Team with comment threads.
  - Complete documentation in rbac.md and GitHub modal.`,
    },
    progress: {
      title: '7. progress.md (Running Log)',
      filename: 'progress.md',
      label: '7. progress.md (Log)',
      content: `# Progress Log: PU Roof Works Operations Hub

## Current Status
- Milestone: Complete & Verified (M0 to M9)
- Role Governance (RBAC):
  - CEO authenticated with PIN \`1234\`.
  - Unrestricted super-user capabilities for CEO.
  - CEO Directives and threaded comments to Admin & functional departments.
  - Role boundary protections for Sales, Warehouse, and Accounting.
- Verified Calculations:
  - runRate(500000, 10, 22) = 1,100,000 [PASSED]
  - zeroSales forecast = 0 without crash [PASSED]
  - Days of cover > 90 days triggers Push List [PASSED]
  - Reorder point formula (avg_daily * lead_time) + safety_stock [PASSED]
- Deliverables:
  - Ingestion interface for 3 CSV files (Cash sales, Invoices, Deposits).
  - Executive Overview with Month-to-date sales and forecast band.
  - Stock Health and Quote Assistant (Track B).
  - CEO Directives & Notes to Admin system with live localStorage persistence.
  - Role Permission Matrix viewer modal and rbac.md specifications.`,
    },
  };

  const activeDocMap = docLang === 'th' ? docsTh : docsEn;
  const current = activeDocMap[activeDoc] || activeDocMap.rbac;

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDoc = () => {
    const filenameToDownload = docLang === 'th' ? `${current.filename.replace('.md', '')}-th.md` : current.filename;
    const blob = new Blob([current.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameToDownload;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modalBgCls = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const headerFooterBg = isDark
    ? 'bg-slate-950 border-slate-800'
    : 'bg-slate-50 border-slate-200';
  const preBgCls = isDark
    ? 'bg-slate-950 border-slate-800 text-slate-300'
    : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-2xl max-w-4xl w-full overflow-hidden my-8 animate-fadeIn ${modalBgCls}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${headerFooterBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                {docLang === 'th'
                  ? 'GitHub Repository: เอกสารสเปกระบบ 7 ฉบับ (ฉบับภาษาไทย)'
                  : 'GitHub Repository: 7 Project Specification Documents'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {docLang === 'th'
                  ? 'เอกสาร Markdown ครบทั้ง 7 ฉบับ แปลไทยสมบูรณ์: สิทธิ์ RBAC, สเปก PRD, กฎ AI, สถาปัตยกรรม, โครงสร้างข้อมูล, แผนงาน และบันทึกผลทดสอบ'
                  : 'All 7 specification & operational documents including CEO (1234) RBAC permissions'}
              </p>
            </div>
          </div>

          {/* Language Toggle & Close Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Direct Doc Language Toggle (Thai / English) */}
            <div
              className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
            >
              <button
                onClick={() => setDocLang('th')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  docLang === 'th'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="อ่านเอกสารฉบับภาษาไทย"
              >
                <span>🇹🇭 ไทย</span>
              </button>
              <button
                onClick={() => setDocLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  docLang === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View in English"
              >
                <span>🇬🇧 EN</span>
              </button>
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
        </div>

        {/* Document Navigation Tabs */}
        <div className={`px-6 py-2.5 border-b flex items-center gap-2 overflow-x-auto text-xs ${headerFooterBg}`}>
          {Object.entries(activeDocMap).map(([key, doc]) => (
            <button
              key={key}
              onClick={() => setActiveDoc(key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeDoc === key
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>{doc.label}</span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>{current.title}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {docLang === 'th' ? '🇹🇭 ฉบับภาษาไทย' : '🇬🇧 English Version'}
              </span>
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300 shadow-2xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? (docLang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!')
                    : (docLang === 'th' ? 'คัดลอก Markdown' : 'Copy Markdown')}
                </span>
              </button>
              <button
                onClick={handleDownloadDoc}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {docLang === 'th'
                    ? `ดาวน์โหลด ${current.filename.replace('.md', '')}-th.md`
                    : `Download ${current.filename}`}
                </span>
              </button>
            </div>
          </div>

          <pre className={`p-4 rounded-xl border text-xs font-mono leading-relaxed overflow-x-auto max-h-[50vh] whitespace-pre-wrap ${preBgCls}`}>
            {current.content}
          </pre>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between text-xs ${headerFooterBg}`}>
          <div className="flex items-center gap-2 text-slate-500 font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>git add . &amp;&amp; git commit -m &quot;Docs: Update {current.filename} ({docLang.toUpperCase()})&quot;</span>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-medium transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
