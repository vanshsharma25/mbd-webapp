create extension if not exists "pgcrypto";

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.model_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  model jsonb not null,
  created_at timestamptz not null default now()
);

create table public.simulation_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  model_version_id uuid not null references public.model_versions(id),
  status text not null check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  result_path text,
  solver_log text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.projects enable row level security;
alter table public.model_versions enable row level security;
alter table public.simulation_runs enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert on public.model_versions to authenticated;
grant select, insert, update on public.simulation_runs to authenticated;

create policy "Users access own projects" on public.projects for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Users read own model versions" on public.model_versions for select using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Users create own model versions" on public.model_versions for insert with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "Users access own runs" on public.simulation_runs for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
