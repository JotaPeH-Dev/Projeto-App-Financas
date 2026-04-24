import * as SQLite from 'expo-sqlite';

// Verifique se o 'export' está aqui!
export interface Transaction {
  id: number;
  user_id: number;
  label: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
}

export interface TransactionSummary {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const db = SQLite.openDatabaseSync('financas.db');

export const TransactionService = {
  
  // 1. ADICIONE ESTE MÉTODO AQUI (O que estava faltando)
  getTransactions: async (userId: number): Promise<Transaction[]> => {
    return await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
  },

  // 2. Mantenha os outros que você já tem
  getTotalBalance: async (userId: number): Promise<number> => {
    const results = await db.getAllAsync<{ type: string; total: number }>(
      'SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type',
      [userId]
    );
    let income = 0;
    let expense = 0;
    results.forEach(row => {
      if (row.type === 'income') income = row.total;
      if (row.type === 'expense') expense = row.total;
    });
    return income - expense;
  },

  getDataForChart: async (userId: number): Promise<TransactionSummary[]> => {
    const results = await db.getAllAsync<{ type: string; total: number }>(
      'SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type',
      [userId]
    );
    return results.map(row => ({
      name: row.type === 'income' ? 'Entradas' : 'Saídas',
      value: row.total,
      color: row.type === 'income' ? '#2ecc71' : '#e74c3c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));
  },

  addTransaction: async (userId: number, label: string, value: number, type: 'income' | 'expense') => {
    return await db.runAsync(
      'INSERT INTO transactions (user_id, label, value, type, date) VALUES (?, ?, ?, ?, ?)',
      [userId, label, value, type, new Date().toISOString()]
    );
  }
};