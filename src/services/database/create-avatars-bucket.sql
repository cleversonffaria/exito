-- Criar bucket para avatares no Storage (se não existir)
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR
INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Política para permitir leitura pública
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

CREATE POLICY "Public can view avatars" ON storage.objects FOR
SELECT
  TO public USING (bucket_id = 'avatars');

-- Política para permitir que usuários deletem seus próprios avatares
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars'
  AND auth.uid() IN (
    SELECT
      id
    FROM
      users
    WHERE
      avatar_url LIKE '%' || name || '%'
  )
);

-- Política para permitir que professores deletem avatares
DROP POLICY IF EXISTS "Teachers can delete any avatars" ON storage.objects;

CREATE POLICY "Teachers can delete any avatars" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars'
  AND auth.uid() IN (
    SELECT
      id
    FROM
      users
    WHERE
      role = 'teacher'
  )
);