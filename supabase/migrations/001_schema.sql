-- ─── Extensiones ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Tipos ───────────────────────────────────────────────────────────────────
create type user_role as enum ('customer', 'admin');
create type order_status as enum ('pending', 'paid', 'in_production', 'shipped', 'cancelled');

-- ─── profiles ────────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now()
);

-- Trigger: crea el perfil automáticamente al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── products ────────────────────────────────────────────────────────────────
create table products (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,
  name             text not null,
  description      text,
  base_price_mxn   numeric(10,2) not null,
  -- { front: { width_cm, height_cm, offset_x_pct, offset_y_pct } }
  print_area       jsonb not null,
  mockup_front_url text,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ─── product_variants ────────────────────────────────────────────────────────
create table product_variants (
  id                  uuid primary key default uuid_generate_v4(),
  product_id          uuid not null references products on delete cascade,
  color_name          text not null,
  color_hex           text not null,
  size                text not null, -- S | M | L | XL | XXL
  sku                 text unique not null,
  printful_variant_id text,
  extra_price_mxn     numeric(10,2) not null default 0
);

-- ─── designs ────────────────────────────────────────────────────────────────
create table designs (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references profiles on delete cascade,
  original_file_url  text not null,
  width_px           integer not null,
  height_px          integer not null,
  created_at         timestamptz not null default now()
);

-- ─── orders ──────────────────────────────────────────────────────────────────
create table orders (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references profiles on delete restrict,
  status               order_status not null default 'pending',
  total_mxn            numeric(10,2) not null,
  payment_provider     text,
  payment_ref          text,
  payment_status       text,
  shipping_address     jsonb not null,
  fulfillment_provider text,
  fulfillment_ref      text,
  created_at           timestamptz not null default now()
);

-- ─── order_items ─────────────────────────────────────────────────────────────
create table order_items (
  id                  uuid primary key default uuid_generate_v4(),
  order_id            uuid not null references orders on delete cascade,
  product_variant_id  uuid not null references product_variants on delete restrict,
  design_id           uuid not null references designs on delete restrict,
  -- { x_pct, y_pct, scale, rotation } normalizados al print area
  placement           jsonb not null,
  print_file_url      text,
  quantity            integer not null default 1,
  unit_price_mxn      numeric(10,2) not null
);

-- ─── Índices útiles ──────────────────────────────────────────────────────────
create index on orders (user_id, created_at desc);
create index on order_items (order_id);
create index on designs (user_id);
create index on product_variants (product_id);
