-- ─── Storage bucket: designs (privado) ───────────────────────────────────────
-- Ejecutar desde Supabase Dashboard > SQL Editor

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'designs',
  'designs',
  false,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- ─── Policies de Storage ─────────────────────────────────────────────────────

-- El usuario solo puede subir a su propia carpeta: designs/{user_id}/...
create policy "Usuario sube sus diseños"
  on storage.objects for insert
  with check (
    bucket_id = 'designs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- El usuario puede leer sus propios archivos (para mostrar en el canvas)
create policy "Usuario lee sus diseños"
  on storage.objects for select
  using (
    bucket_id = 'designs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- El usuario puede eliminar sus propios archivos
create policy "Usuario elimina sus diseños"
  on storage.objects for delete
  using (
    bucket_id = 'designs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- El admin puede leer todos los archivos (para descargar el print file en M5)
create policy "Admin lee todos los diseños en storage"
  on storage.objects for select
  using (
    bucket_id = 'designs'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
