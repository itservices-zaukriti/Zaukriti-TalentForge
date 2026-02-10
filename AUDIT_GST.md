# TalentForge Audit - GST Compliance
**Confidential & Proprietary - Zaukriti TalentForge**
**Date:** 2026-02-07

## 1. Nature of Service:
TalentForge facilitates **Technical Skills Evaluation** and **Professional Certification**. This is classified under **Online Information and Database Access or Retrieval (OIDAR)** or **Professional Educational Training** depending on specific service bundles (HSN/SAC Codes).

## 2. Tax Applicability
- **GST Rate:** 18% (Applicable on Platform Fee).
- **Collection Responsibility:** Zaukriti Technologies Private Limited.
- **Invoice Generation:** Razorpay (Automated).
- **Reverse Charge Mechanism:** Not Applicable on B2C.

## 3. Revenue Recognition (Strict)
- **Point of Taxation:** Upon Payment Success.
- **Refund Adjustments:** Credit Note issued only for strict policy refunds (See Consumer Protection Audit).
- **Referral Pay-outs:** Treated as **Professional Service / Consultants**. TDS deducted per Income Tax Act, 1961. Not GST Input Tax Credit eligible for participants.

## 4. Documentation Trail
| Key Document | Database Reference | External Validator |
| :--- | :--- | :--- |
| **User Payment** | `applicants.payment_reference` | Razorpay Dashboard |
| **Invoice** | `applicants.created_at` | Razorpay Invoice ID |
| **Referral Payout** | `referrals.status` | Bank Statement |

---

**Status:** COMPLIANT (Subject to CA Audit)
**Auditor:** System Architect (Automated)
