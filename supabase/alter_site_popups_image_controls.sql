alter table if exists public.site_popups
  add column if not exists image_scale numeric not null default 1,
  add column if not exists image_offset_x integer not null default 0,
  add column if not exists image_offset_y integer not null default 0,
  add column if not exists image_fit text not null default 'cover',
  add column if not exists image_area_size text not null default 'md';
