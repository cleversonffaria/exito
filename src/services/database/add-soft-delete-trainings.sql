-- =============================================================================
-- IMPLEMENTAR SOFT DELETE PARA TREINOS
-- =============================================================================
-- 1. Adicionar campo deleted_at na tabela trainings
ALTER TABLE
  trainings
ADD
  COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Adicionar campo deleted_at na tabela training_exercises
ALTER TABLE
  training_exercises
ADD
  COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 3. Comentários para documentar os campos
COMMENT ON COLUMN trainings.deleted_at IS 'Data de exclusão do treino (soft delete). NULL = ativo, data = excluído';

COMMENT ON COLUMN training_exercises.deleted_at IS 'Data de exclusão do exercício do treino (soft delete). NULL = ativo, data = excluído';

-- 4. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_trainings_deleted_at ON trainings(deleted_at);

CREATE INDEX IF NOT EXISTS idx_training_exercises_deleted_at ON training_exercises(deleted_at);

-- 5. Atualizar políticas RLS para trainings
DROP POLICY IF EXISTS "Teachers can view own trainings" ON trainings;

CREATE POLICY "Teachers can view own trainings" ON trainings FOR
SELECT
  USING (
    teacher_id = auth.uid()
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Teachers can insert trainings" ON trainings;

CREATE POLICY "Teachers can insert trainings" ON trainings FOR
INSERT
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can update own trainings" ON trainings;

CREATE POLICY "Teachers can update own trainings" ON trainings FOR
UPDATE
  USING (teacher_id = auth.uid());

-- 6. Atualizar políticas RLS para training_exercises
DROP POLICY IF EXISTS "Teachers can view training exercises" ON training_exercises;

CREATE POLICY "Teachers can view training exercises" ON training_exercises FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        trainings
      WHERE
        trainings.id = training_exercises.training_id
        AND trainings.teacher_id = auth.uid()
        AND trainings.deleted_at IS NULL
    )
    AND training_exercises.deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Teachers can insert training exercises" ON training_exercises;

CREATE POLICY "Teachers can insert training exercises" ON training_exercises FOR
INSERT
  WITH CHECK (
    EXISTS (
      SELECT
        1
      FROM
        trainings
      WHERE
        trainings.id = training_exercises.training_id
        AND trainings.teacher_id = auth.uid()
        AND trainings.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Teachers can update training exercises" ON training_exercises;

CREATE POLICY "Teachers can update training exercises" ON training_exercises FOR
UPDATE
  USING (
    EXISTS (
      SELECT
        1
      FROM
        trainings
      WHERE
        trainings.id = training_exercises.training_id
        AND trainings.teacher_id = auth.uid()
    )
  );