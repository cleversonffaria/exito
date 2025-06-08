/**
 * Sistema universal de warnings para desenvolvimento
 *
 * @example
 * // Para contextos perdidos
 * devWarnings.contextMissing("Button", "Button.Root");
 *
 * // Para funções chamadas fora do contexto
 * devWarnings.functionCalledOutsideContext("setLoading", "Button.Root");
 *
 * // Para mensagens customizadas
 * devWarnings.custom("Valor inválido detectado", "🚨");
 */
export const devWarning = {
  contextMissing: (componentName: string, rootComponent: string) => {
    if (__DEV__) {
      console.warn(
        `⚠️ Os componentes ${componentName} devem ser usados dentro de ${rootComponent}\n` +
          `Voltando aos valores padrão. Por favor, embrulhe seus componentes com ${rootComponent}`
      );
    }
  },

  functionCalledOutsideContext: (
    functionName: string,
    rootComponent: string
  ) => {
    if (__DEV__) {
      console.warn(
        `⚠️ ${functionName} foi chamada fora do contexto ${rootComponent}`
      );
    }
  },

  deprecatedUsage: (oldPattern: string, newPattern: string) => {
    if (__DEV__) {
      console.warn(
        `⚠️ Padrão descontinuado: "${oldPattern}"\n` +
          `Use o novo padrão: "${newPattern}"`
      );
    }
  },

  missingProps: (componentName: string, requiredProps: string[]) => {
    if (__DEV__) {
      console.warn(
        `⚠️ ${componentName} está faltando props obrigatórias: ${requiredProps.join(
          ", "
        )}`
      );
    }
  },

  custom: (message: string, emoji = "⚠️") => {
    if (__DEV__) {
      console.warn(`${emoji} ${message}`);
    }
  },
};
