# Architecture: PU Roof Works Operations & Express Hub

## High-Level Flow
```
[Express Accounting Software]
       |  Export
       v
3 CSV Files (Cash Sales, Invoices/AR, Deposits)
       |
       v
[CSV Parser Engine (csvParser.ts)] <--- Handles commas, quotes, encoding, auto-detection
       |
       v
[State Manager (React State + LocalStorage)]
       |
       +---> [Track A Engine (calculations.ts)]: Run Rate, Seasonal Adjust, Low/Base/High Forecast
       +---> [Track B Engine (calculations.ts)]: Days of Cover, Reorder Point, Price Guardrails
       |
       v
[Views / Dashboard Components]
       |-- 1. ข้อมูลและการนำเข้า (Data & 3 CSV Import)
       |-- 2. ภาพรวมบริษัท (Executive CEO Overview)
       |-- 3. สินค้าขายดี / ค้างสต็อก (Stock Health & Push List)
       |-- 4. ติดตามงานและจัดส่ง (Production & Delivery Tracker)
       |-- 5. ลูกค้าและช่าง (Customer & Contractor Accounts)
       |-- 6. ขายเชื่อและลูกหนี้ (Credit Sales & AR Aging)
       |-- 7. ใบรับมัดจำ (Deposit Receipts Ledger)
       |-- 8. ข้อเสนอแนะอัตโนมัติ (AI Action Engine)
       +-- Interactive Quote Builder Modal
       +-- GitHub 6-Docs Viewer Modal
```

## Tech Decisions
- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS with dark slate theme matching the executive mockup (`preview.webp`).
- **Icons**: Lucide React.
- **Charts**: Recharts & custom responsive SVG data bars.
- **State**: Reactive local state persisted to `localStorage` under `pu_roof_works_data`.
