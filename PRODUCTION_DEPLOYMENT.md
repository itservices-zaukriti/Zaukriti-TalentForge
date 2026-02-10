# Production Deployment Record - Zaukriti TalentForge
**Date:** 2026-02-07
**Status:** READY FOR GO-LIVE
**System State:** Operationally Sovereign

## 1. Environment Verification
- **Platform:** Vercel (Frontend/API) + Supabase (Database/Auth)
- **Region:** ap-south-1 (Mumbai) [Recommended for IST alignment]
- **Timezone Strategy:** Server UTC. Phase transitions occur at ~05:30 AM IST (00:00 UTC).

## 2. Environment Variables Checklist
Ensure these are set in Vercel Project Settings > Environment Variables:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API Key (Safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | **CRITICAL SECRET**. Service Role Key (Backend only) |
| `RAZORPAY_KEY` | Razorpay Live Key ID |
| `RAZORPAY_SECRET` | **CRITICAL SECRET**. Razorpay Live Secret |
| `NEXT_PUBLIC_APP_URL` | `https://talentforge.zaukriti.com` (or similar) |

## 3. Database Migration Manifest
Execute in strict chronological order using `supabase db push` or SQL Editor:

1. `20260207_dpdp_consent.sql` - *Consent Architecture*
2. `20260207_eligibility_and_batch_logic.sql` - *Eligibility Rules*
3. `20260207_problem_selection.sql` - *Problem Selection Locking*
4. `20260207_assignment_submission.sql` - *Assignment Intake*
5. `20260207_evaluation_phase.sql` - *Evaluation System (Hidden)*
6. `20260207_results_and_certificates.sql` - *Certificates & Results*

**Verification Command:**
```sql
SELECT name, version FROM supabase_migrations ORDER BY version;
-- Verify table existence
SELECT count(*) FROM information_schema.tables 
WHERE table_name IN ('user_consent', 'problem_statements', 'user_submissions', 'evaluation_scores', 'certificates');
```

## 4. Phase Configuration (Lifecycle)
File: `lib/lifecycle.ts`
Current State:
- **Phase 1 (Active):** Problem Selection (Until Mar 31, 2026)
- **Phase 2 (Locked):** Assignment (Starts Apr 01, 2026)
- **Phase 3 (Locked):** Evaluation (Starts May 01, 2026)
- **Phase 4 (Locked):** Results (Starts Jun 01, 2026)

**Auditors Note:** Lifecycle is hardcoded to specific 2026 dates. No admin override exists. Time travel is impossible without code redeployment.

## 5. Security & RLS Snapshot
- **Applicants:** Users read own; Admin full access.
- **Submissions:** Users create own (once); Admin full access.
- **Evaluations:** Users `SELECT` only outcomes; `INSERT/UPDATE` blocked for all except Service Role.
- **Certificates:** Service Role managed.

## 6. Smoke Test Protocol (Post-Deploy)
1. **User Clean:** Register new user `audit-verified@example.com`.
2. **Payment:** Complete dummy payment (if using test mode for dry run) or live ₹1 payment.
3. **Dashboard:**
   - Verify Timeline: "Problem Selection" = Active.
   - Verify Assignment Card: Locked (Message: "Opens April 1").
   - Verify Evaluation/Results: Hidden.
4. **Action:** Select a Problem Statement.
   - Verify: Selection locked immediately. Irreversible.

## 7. Sign-off
**Constitutional Directives 1-8:** COMPLIANT.
**Drift Status:** ZERO.
**Ready for Public Traffic:** YES.
