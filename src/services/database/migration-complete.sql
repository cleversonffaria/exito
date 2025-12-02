-- =============================================================================
-- MIGRATION COMPLETA DO BANCO DE DADOS - GYM PEI
-- =============================================================================
-- Este arquivo cria toda a estrutura do banco de dados do zero
-- Execute este arquivo em um banco de dados novo do Supabase
-- =============================================================================
-- =============================================================================
-- LIMPEZA (caso necessário rodar novamente)
-- =============================================================================
DROP TABLE IF EXISTS training_logs CASCADE;

DROP TABLE IF EXISTS student_trainings CASCADE;

DROP TABLE IF EXISTS training_exercises CASCADE;

DROP TABLE IF EXISTS trainings CASCADE;

DROP TABLE IF EXISTS exercises CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS exercise_difficulty CASCADE;

DROP TYPE IF EXISTS gender_type CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;

-- =============================================================================
-- ENUMS
-- =============================================================================
CREATE TYPE user_role AS ENUM ('student', 'teacher');

CREATE TYPE gender_type AS ENUM ('Masculino', 'Feminino', 'Outros');

CREATE TYPE exercise_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- =============================================================================
-- TABELAS PRINCIPAIS
-- =============================================================================
-- Tabela de usuários (teachers e students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone VARCHAR(20),
  age INTEGER,
  gender gender_type,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  goal TEXT,
  start_date DATE,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT [] NOT NULL DEFAULT '{}',
  equipment TEXT NOT NULL,
  difficulty exercise_difficulty NOT NULL DEFAULT 'beginner',
  instructions TEXT,
  image_url TEXT,
  video_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE
  SET
    NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de treinos (templates)
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de exercícios do treino
CREATE TABLE training_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER,
  load DECIMAL,
  rest_seconds INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de treinos atribuídos aos estudantes
CREATE TABLE student_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  week_days TEXT [] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de logs de treino
CREATE TABLE training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_training_id UUID NOT NULL REFERENCES student_trainings(id) ON DELETE CASCADE,
  training_exercise_id UUID NOT NULL REFERENCES training_exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER NOT NULL DEFAULT 0,
  repetitions_completed INTEGER,
  load_used DECIMAL(5, 2),
  duration_seconds INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- COMENTÁRIOS NAS COLUNAS
-- =============================================================================
COMMENT ON COLUMN users.deleted_at IS 'Data de exclusão do usuário (soft delete). NULL = ativo, data = excluído';

COMMENT ON COLUMN exercises.deleted_at IS 'Data de exclusão do exercício (soft delete). NULL = ativo, data = excluído';

COMMENT ON COLUMN exercises.description IS 'Descrição detalhada de como executar o exercício';

COMMENT ON COLUMN exercises.image_url IS 'URL da imagem/foto do exercício';

COMMENT ON COLUMN exercises.video_url IS 'URL do vídeo demonstrativo do exercício (opcional)';

COMMENT ON COLUMN exercises.difficulty IS 'Nível de dificuldade do exercício (beginner, intermediate, advanced)';

COMMENT ON COLUMN trainings.deleted_at IS 'Data de exclusão do treino (soft delete). NULL = ativo, data = excluído';

COMMENT ON COLUMN training_exercises.deleted_at IS 'Data de exclusão do exercício do treino (soft delete). NULL = ativo, data = excluído';

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE
UPDATE
  ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at BEFORE
UPDATE
  ON trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_exercises_updated_at BEFORE
UPDATE
  ON training_exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_trainings_updated_at BEFORE
UPDATE
  ON student_trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_logs_updated_at BEFORE
UPDATE
  ON training_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================
-- Índices para usuários
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Índices para exercícios
CREATE INDEX idx_exercises_name ON exercises(name);

CREATE INDEX idx_exercises_created_by ON exercises(created_by);

CREATE INDEX idx_exercises_deleted_at ON exercises(deleted_at);

-- Índices para treinos
CREATE INDEX idx_trainings_teacher_id ON trainings(teacher_id);

CREATE INDEX idx_trainings_deleted_at ON trainings(deleted_at);

-- Índices para exercícios do treino
CREATE INDEX idx_training_exercises_training_id ON training_exercises(training_id);

CREATE INDEX idx_training_exercises_exercise_id ON training_exercises(exercise_id);

CREATE INDEX idx_training_exercises_deleted_at ON training_exercises(deleted_at);

-- Índices para atribuições de treino
CREATE INDEX idx_student_trainings_student_id ON student_trainings(student_id);

CREATE INDEX idx_student_trainings_training_id ON student_trainings(training_id);

CREATE INDEX idx_student_trainings_active ON student_trainings(is_active);

-- Índices para logs
CREATE INDEX idx_training_logs_student_training ON training_logs(student_training_id);

CREATE INDEX idx_training_logs_training_exercise ON training_logs(training_exercise_id);

CREATE INDEX idx_training_logs_completed_at ON training_logs(completed_at);

-- =============================================================================
-- FUNÇÕES AUXILIARES
-- =============================================================================
-- Função para verificar se usuário está ativo
CREATE
OR REPLACE FUNCTION is_user_active(user_id UUID) RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $ $
SELECT
  deleted_at IS NULL
FROM
  users
WHERE
  id = user_id;

$ $;

-- Função para obter treinos do estudante com exercícios
CREATE
OR REPLACE FUNCTION get_student_trainings_with_exercises(student_uuid UUID) RETURNS TABLE (
  training_id UUID,
  training_name TEXT,
  week_days TEXT [],
  exercise_id UUID,
  exercise_name TEXT,
  sets INTEGER,
  repetitions INTEGER,
  load DECIMAL,
  rest_seconds INTEGER,
  order_index INTEGER,
  equipment TEXT,
  muscle_groups TEXT [],
  difficulty exercise_difficulty
) LANGUAGE plpgsql SECURITY DEFINER AS $ $ BEGIN RETURN QUERY
SELECT
  t.id AS training_id,
  t.name AS training_name,
  st.week_days,
  e.id AS exercise_id,
  e.name AS exercise_name,
  te.sets,
  te.repetitions,
  te.load,
  te.rest_seconds,
  te.order_index,
  e.equipment,
  e.muscle_groups,
  e.difficulty
FROM
  student_trainings st
  INNER JOIN trainings t ON t.id = st.training_id
  AND t.deleted_at IS NULL
  INNER JOIN training_exercises te ON te.training_id = t.id
  AND te.deleted_at IS NULL
  INNER JOIN exercises e ON e.id = te.exercise_id
  AND e.deleted_at IS NULL
WHERE
  st.student_id = student_uuid
  AND st.is_active = TRUE
  AND st.start_date <= CURRENT_DATE
  AND (
    st.end_date IS NULL
    OR st.end_date >= CURRENT_DATE
  )
ORDER BY
  t.name,
  te.order_index;

END;

$ $;

-- Função para calcular progresso do estudante
CREATE
OR REPLACE FUNCTION calculate_student_progress(student_uuid UUID, training_id_param UUID) RETURNS TABLE (
  total_exercises BIGINT,
  completed_exercises BIGINT,
  completion_percentage NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER AS $ $ BEGIN RETURN QUERY WITH total AS (
  SELECT
    COUNT(*) AS total
  FROM
    training_exercises te
    INNER JOIN student_trainings st ON st.training_id = te.training_id
  WHERE
    st.student_id = student_uuid
    AND st.training_id = training_id_param
    AND st.is_active = TRUE
    AND te.deleted_at IS NULL
),
completed AS (
  SELECT
    COUNT(DISTINCT tl.training_exercise_id) AS completed
  FROM
    training_logs tl
    INNER JOIN student_trainings st ON st.id = tl.student_training_id
  WHERE
    st.student_id = student_uuid
    AND st.training_id = training_id_param
    AND st.is_active = TRUE
    AND DATE(tl.completed_at) = CURRENT_DATE
)
SELECT
  t.total AS total_exercises,
  COALESCE(c.completed, 0) AS completed_exercises,
  CASE
    WHEN t.total > 0 THEN ROUND(
      (
        COALESCE(c.completed, 0) :: NUMERIC / t.total :: NUMERIC
      ) * 100,
      2
    )
    ELSE 0
  END AS completion_percentage
FROM
  total t
  CROSS JOIN completed c;

END;

$ $;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Ativar RLS em todas as tabelas
ALTER TABLE
  users ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  exercises ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  trainings ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  training_exercises ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  student_trainings ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  training_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS - USERS
-- =============================================================================
-- Usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON users FOR
SELECT
  USING (
    auth.uid() = id
    AND deleted_at IS NULL
  );

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE
  USING (
    auth.uid() = id
    AND deleted_at IS NULL
  );

-- Professores podem ver todos os estudantes
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

-- Professores podem fazer soft delete de estudantes
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

-- =============================================================================
-- POLÍTICAS RLS - EXERCISES
-- =============================================================================
-- Todos podem visualizar exercícios não excluídos
CREATE POLICY "Anyone can view exercises" ON exercises FOR
SELECT
  USING (deleted_at IS NULL);

-- Professores podem criar exercícios
CREATE POLICY "Teachers can create exercises" ON exercises FOR
INSERT
  TO authenticated WITH CHECK (
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
  );

-- Professores podem atualizar exercícios
CREATE POLICY "Teachers can update exercises" ON exercises FOR
UPDATE
  TO authenticated USING (
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

-- Professores podem fazer soft delete de exercícios
CREATE POLICY "Teachers can delete exercises" ON exercises FOR
UPDATE
  TO authenticated USING (
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
  );

-- =============================================================================
-- POLÍTICAS RLS - TRAININGS
-- =============================================================================
-- Professores podem ver seus próprios treinos
CREATE POLICY "Teachers can view own trainings" ON trainings FOR
SELECT
  USING (
    teacher_id = auth.uid()
    AND deleted_at IS NULL
  );

-- Estudantes podem ver treinos atribuídos a eles
CREATE POLICY "Students can view assigned trainings" ON trainings FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        student_trainings st
      WHERE
        st.training_id = trainings.id
        AND st.student_id = auth.uid()
        AND st.is_active = TRUE
    )
    AND deleted_at IS NULL
  );

-- Professores podem criar treinos
CREATE POLICY "Teachers can create trainings" ON trainings FOR
INSERT
  TO authenticated WITH CHECK (
    teacher_id = auth.uid()
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

-- Professores podem atualizar seus próprios treinos
CREATE POLICY "Teachers can update own trainings" ON trainings FOR
UPDATE
  USING (teacher_id = auth.uid());

-- Professores podem fazer soft delete de seus treinos
CREATE POLICY "Teachers can delete own trainings" ON trainings FOR
UPDATE
  USING (teacher_id = auth.uid());

-- =============================================================================
-- POLÍTICAS RLS - TRAINING_EXERCISES
-- =============================================================================
-- Professores podem ver exercícios de treinos que criaram
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

-- Estudantes podem ver exercícios de treinos atribuídos a eles
CREATE POLICY "Students can view assigned training exercises" ON training_exercises FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        student_trainings st
        INNER JOIN trainings t ON t.id = st.training_id
      WHERE
        st.training_id = training_exercises.training_id
        AND st.student_id = auth.uid()
        AND st.is_active = TRUE
    )
    AND training_exercises.deleted_at IS NULL
  );

-- Professores podem criar exercícios em treinos
CREATE POLICY "Teachers can create training exercises" ON training_exercises FOR
INSERT
  TO authenticated WITH CHECK (
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

-- Professores podem atualizar exercícios de treinos
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

-- Professores podem fazer soft delete de exercícios de treinos
CREATE POLICY "Teachers can delete training exercises" ON training_exercises FOR
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

-- =============================================================================
-- POLÍTICAS RLS - STUDENT_TRAININGS
-- =============================================================================
-- Estudantes podem ver seus próprios treinos atribuídos
CREATE POLICY "Students can view own trainings" ON student_trainings FOR
SELECT
  USING (student_id = auth.uid());

-- Professores podem gerenciar atribuições de treino
CREATE POLICY "Teachers can manage student trainings" ON student_trainings FOR ALL TO authenticated USING (
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
);

-- =============================================================================
-- POLÍTICAS RLS - TRAINING_LOGS
-- =============================================================================
-- Estudantes podem gerenciar seus próprios logs
CREATE POLICY "Students can manage own training logs" ON training_logs FOR ALL TO authenticated USING (
  EXISTS (
    SELECT
      1
    FROM
      student_trainings st
    WHERE
      st.id = training_logs.student_training_id
      AND st.student_id = auth.uid()
  )
);

-- Professores podem visualizar todos os logs
CREATE POLICY "Teachers can view all training logs" ON training_logs FOR
SELECT
  TO authenticated USING (
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
  );

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================
-- Bucket para avatares
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Bucket para exercícios
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('exercises', 'exercises', true) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- POLÍTICAS DE STORAGE - AVATARS
-- =============================================================================
-- Upload de avatares para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR
INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Leitura pública de avatares
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

CREATE POLICY "Public can view avatars" ON storage.objects FOR
SELECT
  TO public USING (bucket_id = 'avatars');

-- Usuários podem deletar seus próprios avatares
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name)) [1] = auth.uid() :: text
);

-- Professores podem deletar qualquer avatar
DROP POLICY IF EXISTS "Teachers can delete any avatars" ON storage.objects;

CREATE POLICY "Teachers can delete any avatars" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars'
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

-- =============================================================================
-- POLÍTICAS DE STORAGE - EXERCISES
-- =============================================================================
-- Upload de arquivos de exercícios para professores
DROP POLICY IF EXISTS "Authenticated users can upload exercise files" ON storage.objects;

CREATE POLICY "Authenticated users can upload exercise files" ON storage.objects FOR
INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'exercises'
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

-- Leitura pública de arquivos de exercícios
DROP POLICY IF EXISTS "Public can view exercise files" ON storage.objects;

CREATE POLICY "Public can view exercise files" ON storage.objects FOR
SELECT
  TO public USING (bucket_id = 'exercises');

-- Professores podem deletar arquivos de exercícios
DROP POLICY IF EXISTS "Teachers can delete exercise files" ON storage.objects;

CREATE POLICY "Teachers can delete exercise files" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'exercises'
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

-- =============================================================================
-- FIM DA MIGRATION
-- =============================================================================