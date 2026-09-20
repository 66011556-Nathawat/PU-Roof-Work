# Schema: Express CSV Data Models

## Table 1: Cash Sales (`cash_sales` / CSV ขายเงินสด)
Field | Type | Description | Example
--- | --- | --- | ---
`doc_no` (PK) | string | Express Document Number | "CS6709-0012"
`date` | string (ISO Date) | Sale Date | "2026-09-02"
`customer_name` | string | Customer or Contractor Name | "ช่างเกรียงศักดิ์ สุพรรณ"
`branch` | string | Branch | "สาขาใหญ่ (สำนักงานใหญ่)"
`sku` | string | Product SKU Code | "PU-760-035-BL"
`product_name` | string | Product Description | "หลังคาเมทัลชีท ลอน 760 บุพียูโฟม 1 นิ้ว"
`category` | string | Product Category | "หลังคา PU โฟม"
`quantity` | number | Sold Quantity | 120
`unit` | string | Unit of Measure | "เมตร"
`unit_price` | number | Price per unit in THB | 285.00
`discount` | number | Discount applied in THB | 500.00
`total_amount` | number | Net Amount in THB | 33700.00
`payment_method` | string | Method of payment | "โอนเงิน"

## Table 2: Credit Invoices (`credit_invoices` / CSV ใบกำกับสินค้า / ขายเชื่อ)
Field | Type | Description | Example
--- | --- | --- | ---
`invoice_no` (PK) | string | Express Invoice Number | "IV6708-0112"
`date` | string (ISO Date) | Invoice Issue Date | "2026-08-05"
`due_date` | string (ISO Date) | Payment Due Date | "2026-09-04"
`customer_code` | string | Customer Express ID | "C-0104"
`customer_name` | string | Business/Project Name | "บจก. สยามพาณิชย์ คอนสตรัคชั่น"
`customer_type` | string | Customer Classification | "โครงการ"
`project_name` | string | Construction Site / Project | "โกดังคลังสินค้า คลองหลวง เฟส 2"
`total_amount` | number | Subtotal before VAT | 245000.00
`vat_amount` | number | 7% VAT | 17150.00
`grand_total` | number | Total with VAT | 262150.00
`paid_amount` | number | Amount paid to date | 100000.00
`outstanding_balance` | number | Remaining unpaid debt | 162150.00
`status` | string | Aging status | "เกินกำหนด 1-30 วัน"
`days_overdue` | number | Days past due date | 16

## Table 3: Deposit Receipts (`deposit_receipts` / CSV ใบรับมัดจำ)
Field | Type | Description | Example
--- | --- | --- | ---
`deposit_no` (PK) | string | Express Deposit Number | "DP6709-0008"
`date` | string (ISO Date) | Receipt Date | "2026-09-04"
`customer_code` | string | Customer ID | "C-0210"
`customer_name` | string | Customer Name | "บมจ. เจริญกิจ โลจิสติกส์ พาร์ค"
`job_description` | string | Purpose of Deposit | "มัดจำสั่งผลิตหลังคา PU 2 นิ้ว 1,800 เมตร"
`deposit_amount` | number | Initial Deposit Received | 150000.00
`applied_amount` | number | Amount already used in invoice | 0.00
`remaining_amount` | number | Unused deposit remaining | 150000.00
`status` | string | Deposit Status | "คงเหลือ"
`linked_invoice_no` | string | Associated Invoice (if any) | "IV6709-0015"
