-- Script seguro para corrigir tabela exercises sem dropar
-- 2. Remover campos duplicados e desnecessários
ALTER TABLE
  exercises DROP COLUMN IF EXISTS thumbnail_url,
  DROP COLUMN IF EXISTS video_demo_url;

-- 3. Adicionar colunas que podem estar faltando
ALTER TABLE
  exercises
ADD
  COLUMN IF NOT EXISTS description TEXT,
ADD
  COLUMN IF NOT EXISTS instructions TEXT,
ADD
  COLUMN IF NOT EXISTS image_url TEXT,
ADD
  COLUMN IF NOT EXISTS video_url TEXT;

-- 4. Garantir que difficulty tem valores válidos antes da conversão
UPDATE
  exercises
SET
  difficulty = 'beginner'
WHERE
  difficulty IS NULL
  OR difficulty NOT IN ('beginner', 'intermediate', 'advanced');

-- 6. Definir valor padrão e NOT NULL para difficulty
ALTER TABLE
  exercises
ALTER COLUMN
  difficulty
SET
  DEFAULT 'beginner';

ALTER TABLE
  exercises
ALTER COLUMN
  difficulty
SET
  NOT NULL;

-- 7. Ajustar equipment para NOT NULL se necessário
UPDATE
  exercises
SET
  equipment = 'Peso corporal'
WHERE
  equipment IS NULL
  OR equipment = '';

ALTER TABLE
  exercises
ALTER COLUMN
  equipment
SET
  NOT NULL;

-- Adicionar nova coluna UUID
ALTER TABLE
  exercises
ADD
  COLUMN id_new UUID DEFAULT gen_random_uuid();

-- Atualizar referências na tabela training_exercises
ALTER TABLE
  training_exercises
ADD
  COLUMN exercise_id_new UUID;

UPDATE
  training_exercises
SET
  exercise_id_new = (
    SELECT
      id_new
    FROM
      exercises
    WHERE
      exercises.id = training_exercises.exercise_id
  );

-- Dropar colunas antigas
ALTER TABLE
  training_exercises DROP COLUMN exercise_id;

ALTER TABLE
  exercises DROP COLUMN id;

-- Renomear colunas novas
ALTER TABLE
  exercises RENAME COLUMN id_new TO id;

ALTER TABLE
  training_exercises RENAME COLUMN exercise_id_new TO exercise_id;

-- Recriar constraints
ALTER TABLE
  exercises
ADD
  PRIMARY KEY (id);

ALTER TABLE
  training_exercises
ADD
  CONSTRAINT training_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

-- 9. Recriar índices
DROP INDEX IF EXISTS idx_exercises_name;

DROP INDEX IF EXISTS idx_exercises_created_by;

CREATE INDEX idx_exercises_name ON exercises USING btree (name);

CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises USING btree (created_by);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING gin (muscle_groups);

CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises USING btree (difficulty);

-- 10. Comentários para documentação
COMMENT ON TABLE exercises IS 'Catálogo de exercícios físicos';

COMMENT ON COLUMN exercises.id IS 'Identificador único do exercício';

COMMENT ON COLUMN exercises.name IS 'Nome do exercício';

COMMENT ON COLUMN exercises.description IS 'Descrição geral do exercício';

COMMENT ON COLUMN exercises.description IS 'Descrição detalhada de como executar o exercício';

COMMENT ON COLUMN exercises.muscle_groups IS 'Grupos musculares trabalhados';

COMMENT ON COLUMN exercises.equipment IS 'Equipamento necessário';

COMMENT ON COLUMN exercises.difficulty IS 'Nível de dificuldade (beginner, intermediate, advanced)';

COMMENT ON COLUMN exercises.instructions IS 'Instruções adicionais';

COMMENT ON COLUMN exercises.image_url IS 'URL da imagem do exercício';

COMMENT ON COLUMN exercises.video_url IS 'URL do vídeo demonstrativo (opcional)';

COMMENT ON COLUMN exercises.created_by IS 'Professor que criou o exercício';

COMMENT ON COLUMN exercises.created_at IS 'Data de criação';

COMMENT ON COLUMN exercises.updated_at IS 'Data da última atualização';