create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(), name text not null, contact text not null unique,
  status text not null default 'active', notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists leads (
  id uuid primary key default gen_random_uuid(), customer_id uuid references customers(id), contact text not null,
  services jsonb not null default '[]', total numeric not null default 0, payment_rule text, upfront_payment numeric not null default 0,
  message text not null default '', status text not null default 'new', deployment_eligible boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists projects (
  id uuid primary key default gen_random_uuid(), customer_id uuid references customers(id), name text not null,
  project_type text not null default 'other',
  status text not null default 'development', delivered_at timestamptz, service_expires_at timestamptz, offline_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists reminder_logs (
  id uuid primary key default gen_random_uuid(), dedupe_key text not null unique, project_id uuid references projects(id),
  type text not null, created_at timestamptz not null default now()
);

alter table customers enable row level security;
alter table leads enable row level security;
alter table projects enable row level security;
alter table reminder_logs enable row level security;

alter table leads add column if not exists deployment_eligible boolean not null default false;
alter table projects add column if not exists project_type text not null default 'other';

alter table projects
  drop column if exists github_connection_id,
  drop column if exists netlify_connection_id,
  drop column if exists github_repo,
  drop column if exists netlify_site_id,
  drop column if exists netlify_site_url,
  drop column if exists deployment_enabled;

drop table if exists deployments;
drop table if exists provider_connections;
