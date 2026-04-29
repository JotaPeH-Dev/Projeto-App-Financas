import * as SQLite from "expo-sqlite";

export interface Transaction {
  cat: string;
  id: number;
  user_id: number;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

export interface TransactionSummary {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const db = SQLite.openDatabaseSync("financas.db");

// --- FUNÇÕES EXPORTADAS ---

export async function addTransaction(
  userId: number,
  label: string,
  value: number,
  type: "income" | "expense",
  date: string, 
  category: string
) {
  return await db.runAsync(
    "INSERT INTO transactions (user_id, label, value, type, date, category) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, label, value, type, date, category],
  );
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  return await db.getAllAsync<Transaction>(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
    [userId],
  );
}

export async function getTotalBalance(userId: number): Promise<number> {
  const results = await db.getAllAsync<{ type: string; total: number }>(
    "SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type",
    [userId],
  );
  let income = 0;
  let expense = 0;
  results.forEach((row) => {
    if (row.type === "income") income = row.total;
    if (row.type === "expense") expense = row.total;
  });
  return income - expense;
}

export async function getDataForChart(
  userId: number,
): Promise<TransactionSummary[]> {
  const results = await db.getAllAsync<{ type: string; total: number }>(
    "SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type",
    [userId],
  );
  return results.map((row) => ({
    name: row.type === "income" ? "Entradas" : "Saídas",
    value: row.total,
    color: row.type === "income" ? "#2ecc71" : "#e74c3c",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
}
export async function deleteTransaction(id: number) {
  return await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function updateTransaction(
  id: number,
  label: string,
  value: number,
  type: 'income' | 'expense',
  date: string,
  category: string // <-- Adicione aqui
) {
  return await db.runAsync(
    'UPDATE transactions SET label = ?, value = ?, type = ?, date = ?, category = ? WHERE id = ?', // <-- Adicione category
    [label, value, type, date, category, id]
  );
}

// Não esqueça de atualizar o objeto exportado no final do arquivo:
export const TransactionService = {
  addTransaction,
  getTransactions,
  getTotalBalance,
  getDataForChart,
  deleteTransaction, // Adicionado
  updateTransaction  // Adicionado
};
