-- Adicionar campo deleted_at para soft delete
ALTER TABLE
  exercises
ADD
  COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Comentário para documentar o campo
COMMENT ON COLUMN exercises.deleted_at IS 'Data de exclusão do exercício (soft delete). NULL = ativo, data = excluído';

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_exercises_deleted_at ON exercises(deleted_at);

-- Atualizar as políticas RLS para considerar apenas exercícios não excluídos
DROP POLICY IF EXISTS "Todos podem visualizar exercícios" ON exercises;

CREATE POLICY "Todos podem visualizar exercícios" ON exercises FOR
SELECT
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Professores podem inserir exercícios" ON exercises;

CREATE POLICY "Professores podem inserir exercícios" ON exercises FOR
INSERT
  TO authenticated WITH CHECK (
    auth.uid() IN (
      SELECT
        id
      FROM
        users
      WHERE
        role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Professores podem atualizar exercícios" ON exercises;

CREATE POLICY "Professores podem atualizar exercícios" ON exercises FOR
UPDATE
  TO authenticated USING (
    auth.uid() IN (
      SELECT
        id
      FROM
        users
      WHERE
        role = 'teacher'
    )
  );

-- Política para soft delete (apenas professores)
DROP POLICY IF EXISTS "Professores podem excluir exercícios" ON exercises;

CREATE POLICY "Professores podem excluir exercícios" ON exercises FOR
UPDATE
  TO authenticated USING (
    auth.uid() IN (
      SELECT
        id
      FROM
        users
      WHERE
        role = 'teacher'
    )
  );