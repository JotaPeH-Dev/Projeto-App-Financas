import * as SQLite from 'expo-sqlite';

// Abre ou conecta ao banco
const db = SQLite.openDatabaseSync('financas.db');

export interface TransactionSummary {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export const TransactionService = {
  // Busca o saldo total (Entradas - Saídas)
  getTotalBalance: async (userId: number): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(CASE WHEN type = "income" THEN value ELSE -value END) as total FROM transactions WHERE user_id = ?',
      [userId]
    );
    return result?.total ?? 0;
  },

  // Busca dados formatados para o PieChart (Gráfico de Pizza)
  getDataForChart: async (userId: number): Promise<TransactionSummary[]> => {
    const rows = await db.getAllAsync<{ type: string, total: number }>(
      'SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type',
      [userId]
    );

    // Mapeia os dados do banco para o formato que o gráfico espera
    return rows.map(row => ({
      name: row.type === 'income' ? 'Entradas' : 'Despesas',
      value: row.total,
      color: row.type === 'income' ? '#2ecc71' : '#e74c3c',
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }));
  },

  // Adiciona uma nova transação
  addTransaction: async (userId: number, label: string, value: number, type: 'income' | 'expense') => {
    await db.runAsync(
      'INSERT INTO transactions (user_id, label, value, type, date) VALUES (?, ?, ?, ?, ?)',
      [userId, label, value, type, new Date().toISOString()]
    );
  }
};