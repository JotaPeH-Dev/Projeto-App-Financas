import { setCategoryBudget, getBudgets, getBudgetEfficiency } from "./database";

export const BudgetService = {
  // Salva ou atualiza o limite (Ex: 'Alimentação', 500)
  updateLimit: async (userId: number, category: string, limit: number) => {
    try {
      await setCategoryBudget(userId, category, limit);
      return true;
    } catch (error) {
      console.error("Erro ao definir limite:", error);
      throw error;
    }
  },

  // Busca todos os limites para listar na tela
  fetchBudgets: async (userId: number) => {
    return await getBudgets(userId);
  },

  // Dados prontos para o gráfico
  getDashboardData: async (userId: number) => {
    return await getBudgetEfficiency(userId);
  }
};