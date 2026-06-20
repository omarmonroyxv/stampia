-- Bucket privado para los archivos de impresión generados
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'print-files',
  'print-files',
  false,
  52428800, -- 50 MB (print files de 300 DPI pueden ser grandes)
  array['image/png']
)
on conflict (id) do nothing;

-- Solo el service_role puede escribir (lo hace el webhook server-side)
-- El admin puede leer para descargar desde el dashboard
create policy "Admin lee print files"
  on storage.objects for select
  using (
    bucket_id = 'print-files'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- El usuario puede leer sus propios print files (carpeta = order_id)
-- Por seguridad, esta policy es opcional para MVP — el admin descarga por el dashboard
create policy "Usuario lee sus print files"
  on storage.objects for select
  using (
    bucket_id = 'print-files'
    and exists (
      select 1 from public.orders
      where id::text = (storage.foldername(name))[1]
        and user_id = auth.uid()
    )
  );
