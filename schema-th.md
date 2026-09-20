# แบบจำลองโครงสร้างข้อมูล (Data Schema Models)
**PU Roof Works — Metal Sheet & PU Foam Manufacturing Operations**

---

## ตารางที่ 1: รายการขายเงินสด (cash_sales / CSV ขายเงินสด)
โครงสร้างข้อมูลรายการขายสดหน้าร้านจาก Express:
- `doc_no` (PK string): เลขที่เอกสาร เช่น "CS6709-0012"
- `date` (string): วันที่เกิดรายการ เช่น "2026-09-02"
- `customer_name` (string): ชื่อลูกค้า / ช่าง เช่น "ช่างเกรียงศักดิ์ สุพรรณ"
- `branch` (string): สาขา เช่น "สาขาใหญ่", "สาขา 2 (บายพาส)"
- `sku` (string): รหัสสินค้า เช่น "PU-760-035-BL"
- `product_name` (string): ชื่อสินค้า เช่น "หลังคาเมทัลชีท ลอน 760 บุพียูโฟม 1 นิ้ว"
- `quantity` (number): จำนวน (เมตร/ชิ้น) เช่น 120
- `unit_price` (number): ราคาต่อหน่วย เช่น 280.83
- `total_amount` (number): ยอดเงินรวม เช่น 33700.00
- `payment_method` (string): วิธีการชำระเงิน เช่น "เงินสด", "โอนเงินผ่านธนาคาร"

---

## ตารางที่ 2: ใบกำกับสินค้า / ขายเชื่อ (credit_invoices / CSV ขายเชื่อ)
โครงสร้างข้อมูลหนี้การค้าและใบกำกับสินค้าจาก Express:
- `invoice_no` (PK string): เลขที่ใบกำกับ เช่น "IV6708-0112"
- `date` (string): วันที่ออกใบกำกับ เช่น "2026-08-05"
- `due_date` (string): วันครบกำหนดชำระ เช่น "2026-09-04"
- `customer_name` (string): ชื่อบริษัท / ผู้รับเหมา เช่น "บจก. สยามพาณิชย์ คอนสตรัคชั่น"
- `customer_type` (string): ประเภทลูกค้า เช่น "ผู้รับเหมาทั่วไป", "โรงงานอุตสาหกรรม"
- `grand_total` (number): ยอดเงินตามบิล เช่น 262150.00
- `paid_amount` (number): ยอดเงินที่ชำระแล้ว เช่น 100000.00
- `outstanding_balance` (number): ยอดหนี้คงค้าง เช่น 162150.00
- `days_overdue` (number): จำนวนวันเกินกำหนด เช่น 16
- `status` (string): สถานะอายุหนี้ เช่น "เกินกำหนด 1-30 วัน", "เกินกำหนด 61-90 วัน"

---

## ตารางที่ 3: ใบรับมัดจำ (deposit_receipts / CSV ใบรับมัดจำ)
โครงสร้างข้อมูลเงินมัดจำรับล่วงหน้าค่าสั่งผลิตหลังคา PU:
- `deposit_no` (PK string): เลขที่ใบรับมัดจำ เช่น "DP6709-0008"
- `date` (string): วันที่รับเงินมัดจำ เช่น "2026-09-04"
- `customer_name` (string): ชื่อลูกค้า เช่น "บมจ. เจริญกิจ โลจิสติกส์ พาร์ค"
- `job_description` (string): รายละเอียดงาน เช่น "งานหลังคาโกดัง 4,500 ตร.ม. บุ PU 2 นิ้ว"
- `deposit_amount` (number): จำนวนเงินมัดจำรับ เช่น 150000.00
- `applied_amount` (number): จำนวนเงินที่ตัดใช้ในใบกำกับแล้ว เช่น 0.00
- `remaining_amount` (number): เงินมัดจำคงเหลือรอนำไปตัดบิล เช่น 150000.00
- `linked_invoice` (string | null): เลขที่ใบกำกับที่เชื่อมโยง
- `status` (string): สถานะ เช่น "คงเหลือรอนำไปใช้", "ตัดใช้ครบแล้ว"

---

## ตารางที่ 4: ข้อสั่งการผู้บริหารและคอมเมนต์ (ceo_directives & comments)
- `id` (PK string): รหัสข้อสั่งการ เช่น "dir-1"
- `title` (string): หัวข้อคำสั่งการ เช่น "ตรวจสอบความถูกต้องของไฟล์ Express 3 CSV"
- `target_role` (string): บทบาทผู้รับผิดชอบ ("admin" | "sales" | "warehouse" | "accounting" | "all")
- `priority` (string): ระดับความเร่งด่วน ("urgent" | "high" | "normal")
- `content` (string): คำสั่งการและข้อความกำชับจาก CEO
- `createdAt` (string): วันเวลาที่สร้างคำสั่งการ
- `dueDate` (string | undefined): กำหนดส่งมอบงาน
- `status` (string): สถานะงาน ("pending" | "in_progress" | "completed")
- `createdBy` (string): ชื่อผู้สั่งการ (คุณชาเอม - CEO)
- `comments` (array): รายการคอมเมนต์และการตอบกลับจาก Admin หรือหัวหน้าฝ่าย
