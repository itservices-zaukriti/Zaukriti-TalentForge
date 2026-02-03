# 💰 Forensic Pricing Audit

## 1️⃣ Source of Truth for Pricing
**Hybrid (Code Primary)**
- **Definition Source:** `app/utils/config.ts` (Code)
- **Calculation Source:** `app/api/register/route.ts` & `app/api/razorpay/order/route.ts` (Code)
- **Record of Truth:** `applicants` table (Database - stores snapshot at registration time)

---

## 2️⃣ Code Path Discovery

### A. Pricing Configuration (Primary Definition)
**File:** `app/utils/config.ts`
- **Lines 16-47:** Defines `PLATFORM_CONFIG.pricing` array (Phases, Dates, Fees).
- **Line 21:** `fees: { individual: 799, ... }` (Hardcoded values).
- **Lines 56-57:** `rewardValue: 50` (Referral amount).

### B. Registration Calculation (Initial Snapshot)
**File:** `app/api/register/route.ts`
- **Line 127:** `const currentPhase = getCurrentPricing();`
- **Line 131:** `fees?.individual ?? 799` (Fallback hardcoded).
- **Line 140:** `discount = 50;` (Hardcoded logic for referral).
- **Line 144:** `const gstRate = 0.18;` (**YES** - Hardcoded).
- **Line 146:** `const finalAmount = discountedPrice + gstAmount;`

### C. Razorpay Order Creation (Payment Execution)
**File:** `app/api/razorpay/order/route.ts`
- **Line 15:** `getCurrentPricing()` (Re-fetches config).
- **Line 50, 55:** `discount = 50;` (Hardcoded).
- **Line 61:** `const gstRate = 0.18;` (**YES** - Hardcoded).
- **Line 63:** `const finalAmount = discountedPrice + gstAmount;`

---

## 3️⃣ Database Write Inspection

### Table: `applicants`
**Location:** `app/api/register/route.ts` (Lines 179-182)
**Timing:** **BEFORE** Payment (Status: 'Pending')

| Column Name | Source Variable |
| :--- | :--- |
| `amount_paid` | `finalAmount` |
| `base_amount` | `basePrice` |
| `discount_amount` | `discount` |
| `gst_amount` | `gstAmount` |
| `pricing_phase` | `currentPhase.name` |

**Integrity Note:** The webhook (`app/api/razorpay/webhook/route.ts`) does **NOT** update these amounts. The values stored at registration are permanent, even if `config.ts` changes before payment.

---

## 4️⃣ Time-Based Logic Check
**YES** - Pricing is date-driven by code.

- **Mechanism:** `getCurrentPricing()` in `app/utils/config.ts` compares `new Date()` against hardcoded start/end dates in the config array.
- **Database Control:** **NO**. There is no database table controlling pricing phases.

---

## 5️⃣ Razorpay Integrity Check & Risks

### ⚠️ Risk: Dual Calculation
Pricing is calculated in TWO places:
1. `register/route.ts` (to store in DB)
2. `razorpay/order/route.ts` (to charge the user)

**Mismatch Scenario:**
If specific hardcoded values (like GST `0.18` or Discount `50`) are changed in one file but not the other, or if `config.ts` dates are modified while a user is between steps 1 and 2:
- **Result:** User is charged `X` (from Order route), but Database says `Y` (from Register route).
- **Audit Impact:** Financial reconciliation mismatch.

---

## 6️⃣ Final Output (Strict)

### 1. Source of Truth
**Code (`app/utils/config.ts`)**

### 2. Table(s) Storing Pricing
`public.applicants` (Snapshot only)

### 3. Can Pricing be Changed via DB Alone?
**NO**

### 4. Safe Way to Modify Pricing
1. Update `app/utils/config.ts`.
2. **Commit and Deploy**.
3. **Wait** 1-2 hours for existing "Pending" registrations to clear before assuming strict consistency.
