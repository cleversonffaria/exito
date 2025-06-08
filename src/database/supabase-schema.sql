-- =============================================================================
-- SCHEMA DO BANCO DE DADOS SUPABASE - GYM PEI
-- =============================================================================
-- Enum para tipo de usuário
CREATE TYPE user_role AS ENUM ('student', 'teacher');

-- Enum para gênero
CREATE TYPE gender_type AS ENUM ('Masculino', 'Feminino', 'Outros');

-- =============================================================================
-- TABELAS PRINCIPAIS
-- =============================================================================
-- Tabela de usuários (teachers e students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  age INTEGER,
  gender gender_type,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  goal TEXT,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  equipment VARCHAR(255) NOT NULL,
  execution_description TEXT,
  thumbnail_url TEXT,
  video_demo_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE
  SET
    NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de grupos musculares
CREATE TABLE muscle_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento exercício -> grupos musculares (many-to-many)
CREATE TABLE exercise_muscle_groups (
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group_id INTEGER REFERENCES muscle_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_group_id)
);

-- Tabela de treinos (templates)
CREATE TABLE trainings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios do treino com configurações
CREATE TABLE training_exercises (
  id SERIAL PRIMARY KEY,
  training_id INTEGER REFERENCES trainings(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER NOT NULL DEFAULT 1,
  load DECIMAL(5, 2),
  rest_seconds INTEGER,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atribuição de treinos para estudantes
CREATE TABLE student_trainings (
  id SERIAL PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  training_id INTEGER REFERENCES trainings(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id) ON DELETE
  SET
    NULL,
    week_days INTEGER [] NOT NULL DEFAULT '{}',
    -- Array de números de 1-7 (segunda a domingo)
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico/log de treinos executados
CREATE TABLE training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_training_id INTEGER REFERENCES student_trainings(id) ON DELETE CASCADE,
  training_exercise_id INTEGER REFERENCES training_exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sets_completed INTEGER NOT NULL DEFAULT 0,
  repetitions_completed INTEGER NOT NULL DEFAULT 0,
  load_used DECIMAL(5, 2),
  notes TEXT,
  duration_seconds INTEGER
);

-- Tabela de progresso dos estudantes
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  training_id INTEGER REFERENCES trainings(id) ON DELETE CASCADE,
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, training_id)
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================
-- Índices para busca de usuários
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_users_role ON users(role);

-- Índices para exercícios
CREATE INDEX idx_exercises_name ON exercises(name);

CREATE INDEX idx_exercises_created_by ON exercises(created_by);

-- Índices para treinos
CREATE INDEX idx_trainings_created_by ON trainings(created_by);

CREATE INDEX idx_training_exercises_training_id ON training_exercises(training_id);

CREATE INDEX idx_training_exercises_exercise_id ON training_exercises(exercise_id);

-- Índices para atribuições de treino
CREATE INDEX idx_student_trainings_student_id ON student_trainings(student_id);

CREATE INDEX idx_student_trainings_training_id ON student_trainings(training_id);

CREATE INDEX idx_student_trainings_active ON student_trainings(is_active);

-- Índices para logs
CREATE INDEX idx_training_logs_student_training ON training_logs(student_training_id);

CREATE INDEX idx_training_logs_completed_at ON training_logs(completed_at);

-- Índices para progresso
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);

-- =============================================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================================================
-- Trigger para atualizar updated_at automaticamente
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ language 'plpgsql';

-- Aplicar trigger nas tabelas necessárias
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE
UPDATE
  ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at BEFORE
UPDATE
  ON trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_trainings_updated_at BEFORE
UPDATE
  ON student_trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE
UPDATE
  ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =============================================================================
-- Ativar RLS nas tabelas principais
ALTER TABLE
  users ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  exercises ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  trainings ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  student_trainings ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  training_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  student_progress ENABLE ROW LEVEL SECURITY;

-- Política para usuários: podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON users FOR
SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE
  USING (auth.uid() = id);

-- Política para professores: podem ver todos os estudantes
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
    )
  );

-- Política para exercícios: todos podem ver, apenas criadores/professores podem editar
CREATE POLICY "Anyone can view exercises" ON exercises FOR
SELECT
  USING (true);

CREATE POLICY "Teachers can create exercises" ON exercises FOR
INSERT
  WITH CHECK (
    EXISTS (
      SELECT
        1
      FROM
        users
      WHERE
        id = auth.uid()
        AND role = 'teacher'
    )
  );

CREATE POLICY "Exercise creators can update" ON exercises FOR
UPDATE
  USING (created_by = auth.uid());

-- Política para treinos: professores podem criar/editar, estudantes podem ver os seus
CREATE POLICY "Teachers can manage trainings" ON trainings FOR ALL USING (
  EXISTS (
    SELECT
      1
    FROM
      users
    WHERE
      id = auth.uid()
      AND role = 'teacher'
  )
);

-- Política para atribuições de treino
CREATE POLICY "Students can view own trainings" ON student_trainings FOR
SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage student trainings" ON student_trainings FOR ALL USING (
  EXISTS (
    SELECT
      1
    FROM
      users
    WHERE
      id = auth.uid()
      AND role = 'teacher'
  )
);

-- Política para logs de treino
CREATE POLICY "Students can manage own training logs" ON training_logs FOR ALL USING (
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

CREATE POLICY "Teachers can view all training logs" ON training_logs FOR
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
    )
  );

-- =============================================================================
-- DADOS INICIAIS
-- =============================================================================
-- Inserir grupos musculares básicos
INSERT INTO
  muscle_groups (name)
VALUES
  ('Peitoral maior'),
  ('Tríceps'),
  ('Bíceps'),
  ('Deltoides'),
  ('Latíssimo do dorso'),
  ('Trapézio'),
  ('Quadríceps'),
  ('Isquiotibiais'),
  ('Glúteos'),
  ('Panturrilha'),
  ('Abdominais'),
  ('Oblíquos'),
  ('Antebraços'),
  ('Romboides'),
  ('Serrátil anterior');

-- =============================================================================
-- FUNÇÕES AUXILIARES
-- =============================================================================
-- Função para obter treinos de um estudante com exercícios
CREATE
OR REPLACE FUNCTION get_student_trainings_with_exercises(student_uuid UUID) RETURNS TABLE (
  training_id INTEGER,
  training_name VARCHAR,
  week_days INTEGER [],
  exercise_id INTEGER,
  exercise_name VARCHAR,
  sets INTEGER,
  repetitions INTEGER,
  load DECIMAL,
  rest_seconds INTEGER,
  notes TEXT,
  equipment VARCHAR,
  muscle_groups TEXT []
) AS $ $ BEGIN RETURN QUERY
SELECT
  t.id as training_id,
  t.name as training_name,
  st.week_days,
  e.id as exercise_id,
  e.name as exercise_name,
  te.sets,
  te.repetitions,
  te.load,
  te.rest_seconds,
  te.notes,
  e.equipment,
  ARRAY_AGG(mg.name) as muscle_groups
FROM
  student_trainings st
  JOIN trainings t ON st.training_id = t.id
  JOIN training_exercises te ON t.id = te.training_id
  JOIN exercises e ON te.exercise_id = e.id
  LEFT JOIN exercise_muscle_groups emg ON e.id = emg.exercise_id
  LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
WHERE
  st.student_id = student_uuid
  AND st.is_active = true
GROUP BY
  t.id,
  t.name,
  st.week_days,
  e.id,
  e.name,
  te.sets,
  te.repetitions,
  te.load,
  te.rest_seconds,
  te.notes,
  e.equipment
ORDER BY
  t.id,
  te.order_index;

END;

$ $ LANGUAGE plpgsql;

-- Função para calcular progresso do estudante
CREATE
OR REPLACE FUNCTION calculate_student_progress(student_uuid UUID, training_id_param INTEGER) RETURNS TABLE (
  total_exercises INTEGER,
  completed_exercises INTEGER,
  completion_percentage DECIMAL
) AS $ $ BEGIN RETURN QUERY
SELECT
  COUNT(te.id) :: INTEGER as total_exercises,
  COUNT(tl.id) :: INTEGER as completed_exercises,
  CASE
    WHEN COUNT(te.id) > 0 THEN ROUND(
      (
        COUNT(tl.id) :: DECIMAL / COUNT(te.id) :: DECIMAL
      ) * 100,
      2
    )
    ELSE 0
  END as completion_percentage
FROM
  training_exercises te
  LEFT JOIN student_trainings st ON te.training_id = st.training_id
  AND st.student_id = student_uuid
  AND st.training_id = training_id_param
  LEFT JOIN training_logs tl ON te.id = tl.training_exercise_id
  AND tl.student_training_id = st.id
  AND DATE(tl.completed_at) = CURRENT_DATE
WHERE
  te.training_id = training_id_param;

END;

$ $ LANGUAGE plpgsql;