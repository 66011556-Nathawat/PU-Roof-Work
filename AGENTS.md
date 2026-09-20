# AGENTS.md — Standing Orders for AI

## Project Context
PU Roof Works Dashboard: Executive decision-support platform for metal sheet and PU foam roof manufacturing company in Thailand. Driven by 3 Express accounting CSV files: Cash Sales, Credit Invoices, and Deposit Receipts.

## Conventions
- **Language**: Bilingual UI (Thai for business labels & terminology: ขายเงินสด, ใบกำกับสินค้า, ใบรับมัดจำ, สต็อก; English for clean code & technical fields).
- **Currency**: Thai Baht (฿ THB) formatted with standard Thai locale separators.
- **Date Format**: YYYY-MM-DD or Thai Buddhist/Gregorian business dates.
- **Code Style**: Pure functional calculations separated from UI components.

## Hard Rules
1. Never hide calculations inside arbitrary black boxes; mathematical formulas must match Track A & B specifications (Run Rate, Seasonal Multiplier, Days of Cover, Reorder Point, Guardrail Floor/Ceiling).
2. No broken buttons or silent click handlers. All actions (upload, sample data, quote calculation, filter, export) must be completely interactive and functional.
3. Keep seed data realistic to genuine Thai industrial roofing manufacturing (e.g. ลอน 760, ฉนวนพียู 1-2 นิ้ว, แผ่นใส, ครอบจั่ว, สกรู).
4. Allow instant data persistence via localStorage so user edits and uploads survive browser refresh.
5. Provide sample CSV downloads and 1-click sample data loading.

## Definition of Done
- Runs cleanly with 0 console errors.
- 3 CSV upload slots operate with auto-detection and file validation.
- All 5 hand-verified test cases pass.
- Matches the design aesthetic of the provided preview screenshot and PDF specifications.
