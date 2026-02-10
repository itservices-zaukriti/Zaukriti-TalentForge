
DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_event_type AS ENUM ('registration', 'reminder', 'proof_due', 'shortlisted', 'rejected', 'payment_pending', 'payment_confirmed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists notification_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  applicant_id uuid references applicants(id),
  domain_slug text,
  channel notification_channel not null,
  event_type notification_event_type not null,
  status notification_status default 'pending',
  scheduled_at timestamptz default now(),
  sent_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_notification_events_status on notification_events(status) where status = 'pending';
create index if not exists idx_notification_events_applicant_event on notification_events(applicant_id, event_type);
