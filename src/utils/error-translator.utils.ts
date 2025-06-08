export const translateSupabaseError = (error: string): string => {
  const errorMap: Record<string, string> = {
    // Auth errors
    "Invalid login credentials": "Credenciais de login inválidas",
    "Email not confirmed": "E-mail não confirmado",
    "User not found": "Usuário não encontrado",
    "Invalid email": "E-mail inválido",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres",
    "User already registered": "Usuário já cadastrado",
    "Email already exists": "E-mail já existe",
    "Signup is disabled": "Cadastro está desabilitado",
    "Invalid password": "Senha inválida",
    "Email rate limit exceeded": "Limite de e-mails excedido",
    "Too many requests": "Muitas tentativas, tente novamente mais tarde",
    "Invalid refresh token": "Token de atualização inválido",
    "Session not found": "Sessão não encontrada",
    "Session expired": "Sessão expirada",
    "Token expired": "Token expirado",
    "Invalid token": "Token inválido",
    Unauthorized: "Não autorizado",
    "Access denied": "Acesso negado",
    Forbidden: "Proibido",

    // Database errors
    "Row not found": "Registro não encontrado",
    "Duplicate key value": "Valor duplicado",
    "Foreign key constraint": "Violação de chave estrangeira",
    "Check constraint": "Violação de restrição",
    "Not null constraint": "Campo obrigatório não preenchido",
    "Unique constraint": "Valor já existe",
    "Permission denied": "Permissão negada",
    "RLS policy": "Política de segurança violada",
    "Insufficient privileges": "Privilégios insuficientes",

    // Network errors
    "Network error": "Erro de conexão",
    "Connection failed": "Falha na conexão",
    Timeout: "Tempo limite excedido",
    "Server error": "Erro no servidor",
    "Service unavailable": "Serviço indisponível",
    "Internal server error": "Erro interno do servidor",
    "Bad gateway": "Gateway inválido",
    "Gateway timeout": "Timeout do gateway",

    // Validation errors
    "Invalid input": "Entrada inválida",
    "Required field": "Campo obrigatório",
    "Invalid format": "Formato inválido",
    "Value too long": "Valor muito longo",
    "Value too short": "Valor muito curto",
    "Invalid date": "Data inválida",
    "Invalid number": "Número inválido",
    "Invalid enum value": "Valor inválido",

    // Custom business errors
    "Exercise not found": "Exercício não encontrado",
    "Training not found": "Treino não encontrado",
    "User profile not found": "Perfil do usuário não encontrado",
    "Already assigned": "Já atribuído",
    "Cannot delete": "Não é possível excluir",
    "Cannot update": "Não é possível atualizar",
    "Invalid role": "Perfil inválido",
    "Student not found": "Estudante não encontrado",
    "Teacher not found": "Professor não encontrado",
    "Training log not found": "Registro de treino não encontrado",
  };

  const lowerError = error.toLowerCase();

  for (const [englishError, portugueseError] of Object.entries(errorMap)) {
    if (lowerError.includes(englishError.toLowerCase())) {
      return portugueseError;
    }
  }

  if (lowerError.includes("constraint")) {
    return "Violação de restrição no banco de dados";
  }

  if (lowerError.includes("postgres") || lowerError.includes("sql")) {
    return "Erro no banco de dados";
  }

  if (lowerError.includes("network") || lowerError.includes("fetch")) {
    return "Erro de conexão com o servidor";
  }

  if (lowerError.includes("auth")) {
    return "Erro de autenticação";
  }

  return error;
};

export const getGenericErrorMessage = (context: string): string => {
  const messages: Record<string, string> = {
    auth: "Erro na autenticação. Tente novamente.",
    exercise: "Erro ao processar exercício. Tente novamente.",
    training: "Erro ao processar treino. Tente novamente.",
    profile: "Erro ao atualizar perfil. Tente novamente.",
    connection: "Erro de conexão. Verifique sua internet.",
    default: "Ocorreu um erro inesperado. Tente novamente.",
  };

  return messages[context] || messages.default;
};
