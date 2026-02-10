# TalentForge DPDP Audit (Data Protection & Digital Privacy)
**Confidential & Proprietary - Zaukriti TalentForge**
**Date:** 2026-02-07

## 1. Compliance Statement
TalentForge adheres to the principles of data minimization, purpose limitation, and storage limitation. We collect only what is necessary for the **Problem Selection → Assignment → Evaluation → Certification** lifecycle.

---

## 2. Data Inventory & Mapping

| Data Category | Tables Involved | Lawful Purpose | Retention Policy |
| :--- | :--- | :--- | :--- |
| **Identity** | `applicants` | Authentication, Eligibility Verification | Deleted 6 Months post-cycle (unless hired) |
| **Contact** | `applicants` | Communication (Email/Phone) | Deleted 6 Months post-cycle |
| **Consent** | `user_consent` | Legal Defense, Dispute Resolution | **Permanent Audit Log** (Immutable) |
| **Payment** | `applicants` (ref) | GST Compliance, Access Control | **7 Years** (Financial Regulation) |
| **Submissions** | `user_submissions` | Evaluation, Proof-of-Work | Deleted 1 Year post-cycle |
| **Outcomes** | `evaluation_outcomes` | Certification Validity | **Permanent** (Certificate Verification) |
| **Certificates** | `certificates` | Career Credentials | **Permanent** (Public Verification) |

---

## 3. Consent Architecture
- **Collection Point:** Registration Form (Mandatory Checkbox).
- **Storage:** `user_consent` table (Timestamp, IP, Version).
- **Scope:** Processing for Evaluation & Hiring **ONLY**. No third-party marketing.
- **Withdrawal:** Users may request withdrawal via support, resulting in account deletion (pre-evaluation).

## 4. Data Processing Rights
1.  **Right to Access:** Users view all stored data via Dashboard.
2.  **Right to Correction:** Profile editable until **Problem Selection Lock**.
3.  **Right to Erasure:** Handled post-cycle or upon specific request (if no financial record exists).
4.  **Right to Grievance:** Dedicated grievance officer contact (compliance@zaukriti.com).

## 5. Security Measures (Technical)
- **Encryption:** Data in transit (TLS 1.2+) and at rest (Supabase Encryption).
- **Access Control:** Row-Level Security (RLS) enforced on ALL tables.
- **Isolation:** Service Role keys isolated; no direct database access for developers.
- **Logs:** Immutable audit logs for critical actions (Login, Payment, Submission).

---

**Status:** COMPLIANT
**Auditor:** System Architect (Automated)
