# สถาปัตยกรรมระบบและการประมวลผลข้อมูล (System Architecture)
**PU Roof Works Operations & Express Hub**

---

## 1. แผนภาพการไหลของข้อมูล (High-Level Data Flow Architecture)

```
[โปรแกรมบัญชี Express Accounting Software]
       │ (ส่งออกไฟล์รายงาน)
       ▼
3 ไฟล์ CSV มาตรฐาน (ขายสด, ขายเชื่อ/ลูกหนี้, ใบรับมัดจำ)
       │
       ▼
[ตัวแปลงไฟล์ CSV (csvParser.ts)] <--- รองรับ UTF-8/TIS-620, เครื่องหมายจุลภาค, ตรวจจับประเภทไฟล์อัตโนมัติ
       │
       ▼
[ระบบจัดการสถานะข้อมูล (React State + LocalStorage Sync)]
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
```

---

## 2. โครงสร้างเลเยอร์ของระบบ (Layered Architecture)

### 2.1 เลเยอร์ส่วนต่อประสานผู้ใช้ (Presentation Layer)
- พัฒนาด้วย React 18 และ TypeScript
- จัดรูปแบบด้วย Tailwind CSS รองรับการปรับธีมสว่าง (Light) และดำสนิท (Executive Black)
- ออกแบบตามหลัก Responsive Design ใช้งานได้สมบูรณ์ทั้งคอมพิวเตอร์ตั้งโต๊ะ แท็บเล็ต และมือถือ

### 2.2 เลเยอร์การคำนวณและตรรกะทางธุรกิจ (Domain Logic Layer)
- แยกฟังก์ชันการคำนวณทางคณิตศาสตร์ทั้งหมดใน `/src/utils/calculations.ts`
- ออกแบบเป็น Pure Functions ปราศจาก Side Effects เพื่อความโปร่งใสและทดสอบได้ง่าย

### 2.3 เลเยอร์ความปลอดภัยและสิทธิ์การใช้งาน (Security & RBAC Layer)
- ควบคุมสิทธิ์การเข้าถึงผ่าน `/src/data/rolePermissions.ts`
- มีระบบป้องกันการทำลายข้อมูล และรหัสผ่าน Master PIN `1234` สำหรับผู้บริหาร (CEO)

### 2.4 เลเยอร์การจัดเก็บข้อมูล (Persistence Layer)
- บันทึกข้อมูลแบบ Client-side LocalStorage รองรับการทำงานแบบออฟไลน์
- สามารถกู้คืนข้อมูลหรือรีเซ็ตกลับเป็นข้อมูลตัวอย่างได้ทันทีในคลิกเดียว
