-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Habilitar RLS en todas las tablas
alter table profiles        enable row level security;
alter table products        enable row level security;
alter table product_variants enable row level security;
alter table designs         enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;

-- Helper: true si el usuario tiene rol admin
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── profiles ────────────────────────────────────────────────────────────────
create policy "Usuario lee su propio perfil"
  on profiles for select
  using (auth.uid() = id);

create policy "Usuario actualiza su propio perfil"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admin lee todos los perfiles"
  on profiles for select
  using (is_admin());

-- ─── products (catálogo público) ─────────────────────────────────────────────
create policy "Cualquiera lee productos activos"
  on products for select
  using (active = true);

create policy "Admin gestiona productos"
  on products for all
  using (is_admin())
  with check (is_admin());

-- ─── product_variants ────────────────────────────────────────────────────────
create policy "Cualquiera lee variantes"
  on product_variants for select
  using (true);

create policy "Admin gestiona variantes"
  on product_variants for all
  using (is_admin())
  with check (is_admin());

-- ─── designs ────────────────────────────────────────────────────────────────
create policy "Usuario lee sus diseños"
  on designs for select
  using (auth.uid() = user_id);

create policy "Usuario crea diseños"
  on designs for insert
  with check (auth.uid() = user_id);

create policy "Usuario elimina sus diseños"
  on designs for delete
  using (auth.uid() = user_id);

create policy "Admin lee todos los diseños"
  on designs for select
  using (is_admin());

-- ─── orders ──────────────────────────────────────────────────────────────────
create policy "Usuario lee sus órdenes"
  on orders for select
  using (auth.uid() = user_id);

create policy "Usuario crea órdenes"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Admin lee y actualiza todas las órdenes"
  on orders for all
  using (is_admin())
  with check (is_admin());

-- ─── order_items ─────────────────────────────────────────────────────────────
create policy "Usuario lee items de sus órdenes"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Usuario crea items en sus órdenes"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Admin lee y actualiza todos los items"
  on order_items for all
  using (is_admin())
  with check (is_admin());

-- ─── Storage: bucket 'designs' (privado) ─────────────────────────────────────
-- Ejecutar desde Supabase Dashboard > Storage > Policies, o via SQL:
-- insert into storage.buckets (id, name, public) values ('designs', 'designs', false);
--
-- create policy "Usuario sube sus diseños"
--   on storage.objects for insert
--   with check (bucket_id = 'designs' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Usuario lee sus diseños"
--   on storage.objects for select
--   using (bucket_id = 'designs' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Admin lee todos los diseños"
--   on storage.objects for select
--   using (bucket_id = 'designs' and is_admin());
