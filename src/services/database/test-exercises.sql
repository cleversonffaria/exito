-- Script para testar a estrutura da tabela exercises
-- Verificar se a tabela existe e sua estrutura
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM
  information_schema.columns
WHERE
  table_name = 'exercises'
ORDER BY
  ordinal_position;

-- Verificar se o enum exercise_difficulty existe
SELECT
  enumlabel
FROM
  pg_enum
WHERE
  enumtypid = (
    SELECT
      oid
    FROM
      pg_type
    WHERE
      typname = 'exercise_difficulty'
  );

-- Contar exercícios existentes
SELECT
  COUNT(*) as total_exercises
FROM
  exercises;

-- Mostrar alguns exercícios de exemplo (se existirem)
SELECT
  id,
  name,
  muscle_groups,
  equipment,
  difficulty,
  image_url IS NOT NULL as has_image,
  video_url IS NOT NULL as has_video
FROM
  exercises
LIMIT
  5;