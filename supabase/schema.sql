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
