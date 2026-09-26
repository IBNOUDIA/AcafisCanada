-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- to create the tables backing member registration, login, dues status and
-- the members-only document list.

create table if not exists members (
  member_id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  city text,
  membership_year integer not null,
  annual_fee text not null,
  issued_at text not null,
  status text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  created_at timestamptz not null default now()
);

-- If the `members` table already existed before payment_status was added,
-- this brings it up to date without touching existing rows.
alter table members add column if not exists payment_status text not null default 'pending';
alter table members drop constraint if exists members_payment_status_check;
alter table members add constraint members_payment_status_check check (payment_status in ('pending', 'paid'));

-- Whether the member ticked "interested in Coop-ACAFIS / Cité-Jardin Ndianda"
-- on the membership form. Purely informational on this side — Coop-ACAFIS
-- acquéreurs are required to be ACAFIS Canada members, but the reverse isn't;
-- this just flags members worth following up with about the coop.
alter table members add column if not exists coop_interest boolean not null default false;

create index if not exists members_email_idx on members (lower(email));

-- Row Level Security stays enabled with no public policies: the server only
-- ever talks to this table using the service_role key (src/server/supabaseClient.ts),
-- which bypasses RLS. No anon/authenticated access is granted or needed.
alter table members enable row level security;

-- Members-only documents (AG minutes, annual financial reports, etc.).
-- file_url points to wherever the secretariat already hosts the PDF (Google
-- Drive/Dropbox share link, etc.) — there is no file upload/storage in this
-- app, so a row is added manually here each time a new document is ready.
create table if not exists member_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  published_at date not null default current_date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table member_documents enable row level security;

-- Example row (edit/delete as needed after running this once):
-- insert into member_documents (title, description, file_url, published_at)
-- values (
--   'Procès-verbal AG Ordinaire 2026',
--   'Compte-rendu de l''Assemblée Générale Ordinaire de janvier 2026.',
--   'https://drive.google.com/...',
--   '2026-01-15'
-- );

-- Family census: children under 18 declared by a member, for youth activity
-- planning (workshops, summer camp...) and an accurate beneficiary count.
-- first_name is optional (families may prefer not to share it); birth_year
-- is what's actually asked for so age stays correct without upkeep.
create table if not exists member_children (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references members (member_id) on delete cascade,
  first_name text,
  birth_year integer not null,
  gender text not null check (gender in ('feminin', 'masculin', 'autre')),
  created_at timestamptz not null default now()
);

create index if not exists member_children_member_id_idx on member_children (member_id);

alter table member_children enable row level security;

-- Per-IP rate limiting for public API endpoints (contact, registration,
-- login, the AI mentor, etc.) — one row per request that counted against a
-- limit. Old rows are cleaned up opportunistically by the app itself, so
-- this table should stay small.
create table if not exists rate_limit_hits (
  id bigint generated always as identity primary key,
  ip text not null,
  bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_lookup_idx on rate_limit_hits (bucket, ip, created_at);

alter table rate_limit_hits enable row level security;

-- Admin accounts (Bureau Exécutif members with dashboard access) and their
-- login sessions. Passwords are bcrypt hashes, never plain text. There is no
-- self-serve signup — an account is created by inserting a row here (the
-- initial password is set programmatically, then the admin can change it
-- from the dashboard).
create table if not exists admins (
  email text primary key,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  token text primary key,
  admin_email text not null references admins (email) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists admin_sessions_email_idx on admin_sessions (admin_email);

alter table admins enable row level security;
alter table admin_sessions enable row level security;

-- nTIC workshops, created by the Bureau Exécutif from the admin dashboard.
-- capacity is the max number of registrations (a member and each of their
-- children count as one seat each).
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text not null,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create index if not exists workshops_starts_at_idx on workshops (starts_at);

alter table workshops enable row level security;

-- One row per seat: child_id null means the member registered themself,
-- otherwise it's one of their declared children (member_children).
create table if not exists workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops (id) on delete cascade,
  member_id text not null references members (member_id) on delete cascade,
  child_id uuid references member_children (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- The same person can't take two seats in the same workshop. coalesce()
-- because a plain unique constraint treats every null child_id as distinct.
create unique index if not exists workshop_registrations_unique_idx
  on workshop_registrations (workshop_id, member_id, coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid));

create index if not exists workshop_registrations_workshop_idx on workshop_registrations (workshop_id);
create index if not exists workshop_registrations_member_idx on workshop_registrations (member_id);

alter table workshop_registrations enable row level security;

-- Seat-limited registration in one transaction: locking the workshop row
-- serializes concurrent sign-ups, so the last seat can't be taken twice.
-- Called by the server via supabase.rpc() with the service_role key only.
create or replace function register_for_workshop(p_workshop_id uuid, p_member_id text, p_child_id uuid)
returns workshop_registrations
language plpgsql
as $$
declare
  w workshops;
  taken integer;
  already integer;
  reg workshop_registrations;
begin
  select * into w from workshops where id = p_workshop_id for update;
  if not found then
    raise exception 'workshop_not_found';
  end if;
  if w.starts_at < now() then
    raise exception 'workshop_past';
  end if;

  -- Checked before capacity: the workshop row is already locked above, so
  -- this is race-free for this workshop, and a member re-clicking "register"
  -- on a now-full workshop gets a clear "already registered" instead of a
  -- misleading "full" (technically true, but not the useful answer for them).
  select count(*) into already from workshop_registrations
    where workshop_id = p_workshop_id
      and member_id = p_member_id
      and coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid)
        = coalesce(p_child_id, '00000000-0000-0000-0000-000000000000'::uuid);
  if already > 0 then
    raise exception 'already_registered';
  end if;

  select count(*) into taken from workshop_registrations where workshop_id = p_workshop_id;
  if taken >= w.capacity then
    raise exception 'workshop_full';
  end if;

  insert into workshop_registrations (workshop_id, member_id, child_id)
  values (p_workshop_id, p_member_id, p_child_id)
  returning * into reg;
  return reg;
exception
  when unique_violation then
    raise exception 'already_registered';
end;
$$;

revoke execute on function register_for_workshop(uuid, text, uuid) from public, anon, authenticated;
