-- =============================================================================
-- MIGRAÇÃO: ALTERAR TIPO DE week_days DE INTEGER[] PARA TEXT[]
-- =============================================================================
-- Este script altera o tipo da coluna week_days na tabela student_trainings
-- para ser compatível com o código TypeScript que sempre trabalha com strings
-- =============================================================================
-- Converter dados existentes: INTEGER[] -> TEXT[]
-- Primeiro, atualizar os dados existentes convertendo números para strings
UPDATE
  student_trainings
SET
  week_days = (
    SELECT
      array_agg(day :: text)
    FROM
      unnest(week_days :: integer []) AS day
  )
WHERE
  week_days IS NOT NULL
  AND array_length(week_days :: integer [], 1) > 0;

-- Alterar o tipo da coluna
ALTER TABLE
  student_trainings
ALTER COLUMN
  week_days TYPE TEXT [] USING week_days :: text [];

-- =============================================================================
-- FIM DA MIGRAÇÃO
-- =============================================================================