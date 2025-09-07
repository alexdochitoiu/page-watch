-- Watcher runs table to store execution results
create table if not exists public.watcher_runs (
  id uuid primary key default gen_random_uuid(),
  watcher_id uuid references public.watchers (id) on delete set null,
  url text not null,
  success boolean not null,
  rule_results jsonb not null,
  screenshot_url text,
  started_at timestamptz not null default now(),
  finished_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Helpful index
create index if not exists watcher_runs_watcher_id_idx on public.watcher_runs (watcher_id);
create index if not exists watcher_runs_created_at_idx on public.watcher_runs (created_at desc);
