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
create table if not exists provider_connections (
  id uuid primary key default gen_random_uuid(), provider text not null check(provider in ('github','netlify')),
  account_id text not null, account_name text not null, encrypted_token text not null, is_default boolean not null default false,
  status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(provider,account_id)
);
create table if not exists projects (
  id uuid primary key default gen_random_uuid(), customer_id uuid references customers(id), name text not null,
  project_type text not null default 'other', deployment_enabled boolean not null default false,
  status text not null default 'development', delivered_at timestamptz, service_expires_at timestamptz, offline_at timestamptz,
  github_connection_id uuid references provider_connections(id), netlify_connection_id uuid references provider_connections(id),
  github_repo text not null default '', netlify_site_id text not null default '', netlify_site_url text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists deployments (
  id uuid primary key default gen_random_uuid(), project_id uuid references projects(id), status text not null,
  commit_message text, deploy_url text, error_log text, created_at timestamptz not null default now()
);
create table if not exists reminder_logs (
  id uuid primary key default gen_random_uuid(), dedupe_key text not null unique, project_id uuid references projects(id),
  type text not null, created_at timestamptz not null default now()
);

alter table customers enable row level security;
alter table leads enable row level security;
alter table provider_connections enable row level security;
alter table projects enable row level security;
alter table deployments enable row level security;
alter table reminder_logs enable row level security;

alter table leads add column if not exists deployment_eligible boolean not null default false;
alter table projects add column if not exists project_type text not null default 'other';
alter table projects add column if not exists deployment_enabled boolean not null default false;
