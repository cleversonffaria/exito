-- =============================================================================
-- IMPLEMENTAR SOFT DELETE PARA USUÁRIOS
-- =============================================================================
-- 1. Adicionar campo deleted_at na tabela users
ALTER TABLE
  users
ADD
  COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Comentário para documentar o campo
COMMENT ON COLUMN users.deleted_at IS 'Data de exclusão do usuário (soft delete). NULL = ativo, data = excluído';

-- 3. Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- 4. Atualizar políticas RLS para users
DROP POLICY IF EXISTS "Users can view own profile" ON users;

CREATE POLICY "Users can view own profile" ON users FOR
SELECT
  USING (
    auth.uid() = id
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE
  USING (
    auth.uid() = id
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Teachers can view all students" ON users;

CREATE POLICY "Teachers can view all students" ON users FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        users
      WHERE
        id = auth.uid()
        AND role = 'teacher'
        AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- 5. Política para professores poderem fazer soft delete de estudantes
DROP POLICY IF EXISTS "Teachers can delete students" ON users;

CREATE POLICY "Teachers can delete students" ON users FOR
UPDATE
  USING (
    role = 'student'
    AND EXISTS (
      SELECT
        1
      FROM
        users
      WHERE
        id = auth.uid()
        AND role = 'teacher'
        AND deleted_at IS NULL
    )
  );

-- 6. Função para verificar se usuário está ativo (para autenticação)
CREATE
OR REPLACE FUNCTION is_user_active(user_id UUID) RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $ $
SELECT
  deleted_at IS NULL
FROM
  users
WHERE
  id = user_id;

$ $;