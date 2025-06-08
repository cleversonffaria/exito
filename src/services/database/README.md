# Schema do Banco de Dados - GYM PEI

Este documento descreve a estrutura do banco de dados Supabase para o aplicativo GYM PEI.

## Visão Geral

O sistema foi projetado para gerenciar:

- **Usuários** (Professores e Estudantes)
- **Exercícios** e seus grupos musculares
- **Treinos** (templates criados por professores)
- **Atribuições de treino** para estudantes
- **Logs de execução** e progresso

## Estrutura das Tabelas

### 1. `users`

Armazena informações de professores e estudantes.

```sql
- id: UUID (PK) - Identificador único do usuário
- email: VARCHAR - Email único para login
- name: VARCHAR - Nome completo
- phone: VARCHAR - Telefone de contato
- age: INTEGER - Idade
- gender: ENUM - 'Masculino', 'Feminino', 'Outros'
- avatar_url: TEXT - URL da foto de perfil
- role: ENUM - 'student' ou 'teacher'
- goal: TEXT - Objetivo do usuário (para estudantes)
- start_date: DATE - Data de início
```

### 2. `exercises`

Catálogo de exercícios disponíveis.

```sql
- id: SERIAL (PK) - ID do exercício
- name: VARCHAR - Nome do exercício
- muscle_groups: TEXT[] - Array de grupos musculares (ex: ["Peitoral maior", "Tríceps"])
- equipment: VARCHAR - Equipamento necessário
- execution_description: TEXT - Descrição da execução
- thumbnail_url: TEXT - URL da imagem do exercício
- video_demo_url: TEXT - URL do vídeo demonstrativo
- created_by: UUID (FK) - Professor que criou o exercício
```

### 5. `trainings`

Templates de treino criados por professores.

```sql
- id: SERIAL (PK) - ID do treino
- name: VARCHAR - Nome do treino
- created_by: UUID (FK) - Professor que criou o treino
```

### 6. `training_exercises`

Exercícios que compõem um treino com suas configurações.

```sql
- id: SERIAL (PK) - ID único
- training_id: INTEGER (FK) - Referência ao treino
- exercise_id: INTEGER (FK) - Referência ao exercício
- sets: INTEGER - Número de séries
- repetitions: INTEGER - Número de repetições
- load: DECIMAL - Carga a ser utilizada
- rest_seconds: INTEGER - Tempo de descanso em segundos
- notes: TEXT - Observações específicas
- order_index: INTEGER - Ordem do exercício no treino
```

### 7. `student_trainings`

Atribuição de treinos para estudantes específicos.

```sql
- id: SERIAL (PK) - ID da atribuição
- student_id: UUID (FK) - Estudante que recebeu o treino
- training_id: INTEGER (FK) - Treino atribuído
- assigned_by: UUID (FK) - Professor que fez a atribuição
- week_days: INTEGER[] - Array com dias da semana (1-7)
- start_date: DATE - Data de início
- end_date: DATE - Data de término (opcional)
- is_active: BOOLEAN - Se a atribuição está ativa
```

### 8. `training_logs`

Histórico de execução dos treinos pelos estudantes.

```sql
- id: UUID (PK) - ID único do log
- student_training_id: INTEGER (FK) - Atribuição de treino
- training_exercise_id: INTEGER (FK) - Exercício específico
- completed_at: TIMESTAMP - Data/hora da execução
- sets_completed: INTEGER - Séries completadas
- repetitions_completed: INTEGER - Repetições completadas
- load_used: DECIMAL - Carga utilizada
- notes: TEXT - Observações do estudante
- duration_seconds: INTEGER - Duração do exercício
```

## Relacionamentos

```
users (teacher) 1:N exercises
users (teacher) 1:N trainings
users (student) 1:N student_trainings
trainings 1:N training_exercises

student_trainings 1:N training_logs
```

## Segurança (RLS)

O sistema utiliza Row Level Security do Supabase:

- **Estudantes**: Podem ver apenas seus próprios dados
- **Professores**: Podem ver todos os estudantes e gerenciar exercícios/treinos
- **Exercícios**: Visíveis para todos, editáveis pelos criadores
- **Logs**: Estudantes gerenciam os próprios, professores visualizam todos

## Funções Auxiliares

### `get_student_trainings_with_exercises(student_uuid)`

Retorna todos os treinos ativos de um estudante com os exercícios e detalhes.

### `calculate_student_progress(student_uuid, training_id)`

Calcula o progresso de um estudante em um treino específico.

## Como Usar

1. **Instalação**: Execute o arquivo `supabase-schema.sql` no seu projeto Supabase
2. **Autenticação**: Configure o Supabase Auth para usar os UUIDs como referência
3. **Primeira configuração**: Crie um usuário professor para começar a cadastrar exercícios
4. **Dados iniciais**: Os grupos musculares básicos já são inseridos automaticamente

## Exemplos de Queries

### Buscar treinos de um estudante

```sql
SELECT * FROM get_student_trainings_with_exercises('uuid-do-estudante');
```

### Buscar exercícios por grupo muscular

```sql
-- Buscar exercícios que trabalham Peitoral maior
SELECT * FROM exercises
WHERE muscle_groups @> '["Peitoral maior"]';

-- Buscar exercícios que trabalham qualquer músculo do peito
SELECT * FROM exercises
WHERE EXISTS (
  SELECT 1 FROM unnest(muscle_groups) AS mg
  WHERE mg ILIKE '%peitoral%'
);
```

### Calcular progresso diário

```sql
SELECT * FROM calculate_student_progress('uuid-do-estudante', 1);
```

## Considerações de Performance

- Índices criados automaticamente para buscas frequentes
- Triggers para atualização automática de timestamps
- Funções otimizadas para consultas complexas
- RLS para segurança sem impacto significativo na performance
