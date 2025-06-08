-- Adicionar novos campos na tabela exercises
ALTER TABLE
  exercises
ADD
  COLUMN IF NOT EXISTS description TEXT,
ADD
  COLUMN IF NOT EXISTS image_url TEXT,
ADD
  COLUMN IF NOT EXISTS video_url TEXT,
ADD
  COLUMN IF NOT EXISTS difficulty exercise_difficulty DEFAULT 'beginner';

-- Comentários para documentar os campos
COMMENT ON COLUMN exercises.description IS 'Descrição detalhada de como executar o exercício';

COMMENT ON COLUMN exercises.image_url IS 'URL da imagem/foto do exercício';

COMMENT ON COLUMN exercises.video_url IS 'URL do vídeo demonstrativo do exercício (opcional)';

COMMENT ON COLUMN exercises.difficulty IS 'Nível de dificuldade do exercício (beginner, intermediate, advanced)';

-- Criar bucket para exercícios no Storage (se não existir)
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('exercises', 'exercises', true) ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload exercise files" ON storage.objects;

CREATE POLICY "Authenticated users can upload exercise files" ON storage.objects FOR
INSERT
  TO authenticated WITH CHECK (bucket_id = 'exercises');

-- Política para permitir leitura pública
DROP POLICY IF EXISTS "Public can view exercise files" ON storage.objects;

CREATE POLICY "Public can view exercise files" ON storage.objects FOR
SELECT
  TO public USING (bucket_id = 'exercises');

-- Política para permitir que professores deletem arquivos
DROP POLICY IF EXISTS "Teachers can delete exercise files" ON storage.objects;

CREATE POLICY "Teachers can delete exercise files" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'exercises'
  AND auth.uid() IN (
    SELECT
      id
    FROM
      users
    WHERE
      role = 'teacher'
  )
);