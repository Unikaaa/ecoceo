-- Add personalization profiles to product_types
-- Run this in Supabase SQL editor.

alter table if exists public.product_types
add column if not exists personalization_type text not null default 'FIXED_SHAPE';

alter table if exists public.product_types
add column if not exists allowed_shapes text[] null;

-- Optional: basic check constraint
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_types_personalization_type_check'
  ) then
    alter table public.product_types
    add constraint product_types_personalization_type_check
    check (personalization_type in ('FIXED_SHAPE','GEOMETRIC_SUPPORT'));
  end if;
end $$;

