-- Migration: Relax unique constraint to allow multiple registrations per user per phase (one per track)
-- Step 1: Drop the strict (user_id, pricing_phase) constraint
DROP INDEX IF EXISTS idx_applicants_user_phase;

-- Step 2: Add new constraint (user_id, pricing_phase, track)
-- This allows:
-- User A, Phase 1, Track 'AI'
-- User A, Phase 1, Track 'WEB'
-- But prevents:
-- User A, Phase 1, Track 'AI' (Duplicate)
CREATE UNIQUE INDEX IF NOT EXISTS idx_applicants_user_phase_track
ON applicants (user_id, pricing_phase, track);
