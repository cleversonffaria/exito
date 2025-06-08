import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  getItem: async (name: string) => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value || null;
    } catch (error) {
      console.error("Erro ao carregar dados do SecureStore:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("Erro ao salvar dados no SecureStore:", error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("Erro ao remover dados do SecureStore:", error);
    }
  },
};
