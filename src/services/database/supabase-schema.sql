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
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone VARCHAR(20),
  age INTEGER,
  gender gender_type,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  goal TEXT,
  start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT [] NOT NULL DEFAULT '{}',
  equipment TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (
    difficulty IN ('beginner', 'intermediate', 'advanced')
  ),
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de treinos (templates)
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de exercícios do treino
CREATE TABLE training_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL DEFAULT 1,
  reps INTEGER,
  weight DECIMAL,
  rest_time INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
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
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER NOT NULL DEFAULT 0,
  reps_completed INTEGER,
  weight_used DECIMAL,
  duration INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
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