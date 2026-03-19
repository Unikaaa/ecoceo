-- Tabelle popup sito (dashboard -> frontend)
create table if not exists public.site_popups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  image_scale numeric not null default 1,
  image_offset_x integer not null default 0,
  image_offset_y integer not null default 0,
  image_fit text not null default 'cover',
  image_area_size text not null default 'md',
  buttons jsonb not null default '[]'::jsonb,
  starts_at timestamptz not null,
  ends_at timestamptz null,
  event_type text not null default 'announcement',
  event_label text not null default '',
  is_active boolean not null default true,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_popups_event_type_check check (event_type in ('announcement', 'discount', 'event')),
  constraint site_popups_image_fit_check check (image_fit in ('cover', 'contain')),
  constraint site_popups_image_area_check check (image_area_size in ('sm', 'md', 'lg'))
);

create index if not exists site_popups_active_idx on public.site_popups (is_active, starts_at, ends_at);
create index if not exists site_popups_priority_idx on public.site_popups (priority desc, created_at desc);

create or replace function public.update_site_popups_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_popups_updated_at on public.site_popups;
create trigger trg_site_popups_updated_at
before update on public.site_popups
for each row
execute function public.update_site_popups_updated_at();
