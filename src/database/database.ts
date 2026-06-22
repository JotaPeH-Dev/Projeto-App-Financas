import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const db = isWeb ? null : SQLite.openDatabaseSync("financas.db");

// --- Interfaces ---
export interface Transaction {
  id?: number;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
  category?: string;
  user_id: number;
}

interface TransactionRow extends Transaction {
  id: number;
}

interface StatsRow {
  total_income: number;
  total_expense: number;
  transaction_count: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  is_admin: number;
  created_at: string;
}

// --- Inicialização do Banco ---
export const initDatabase = async () => {
  if (isWeb || !db) return;

  try {
    // 1. Criar Tabelas
    db.runSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value REAL NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        date TEXT NOT NULL,
        category TEXT,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS categories_budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL,
        limit_value REAL NOT NULL,
        user_id INTEGER NOT NULL,
        UNIQUE(category_name, user_id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Migração de coluna antiga, se necessário
    try {
      db.runSync("ALTER TABLE transactions ADD COLUMN category TEXT;");
      console.log("Coluna category adicionada com sucesso.");
    } catch (e) {
      // Se a coluna já existir, ignora o erro silenciosamente
    }

    // 2. Criar Índices
    db.runSync(
      "CREATE INDEX IF NOT EXISTS idx_trans_user ON transactions(user_id);",
    );
    db.runSync(
      "CREATE INDEX IF NOT EXISTS idx_trans_date ON transactions(date);",
    );

    // 3. Atualizar Admin (Desenvolvimento)
    try {
      db.runSync(
        "UPDATE users SET is_admin = 1 WHERE email = 'joao@gmail.com';",
      );
    } catch (e) {
      console.log("Usuário admin não encontrado para atualização.");
    }

    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
    throw error;
  }
};

// --- Funções de Usuário ---
export const createUser = async (
  user: Omit<User, "id" | "created_at">,
): Promise<number> => {
  if (!db) throw new Error("DB não pronto");
  const result = db.runSync(
    "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?);",
    [user.name, user.email, user.password, user.is_admin ? 1 : 0],
  );
  return result.lastInsertRowId;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!db) return null;
  const row = db.getFirstSync("SELECT * FROM users WHERE email = ?;", [
    email,
  ]) as UserRow | null;
  if (!row) return null;
  return { ...row, is_admin: row.is_admin === 1 };
};

export const getUserById = async (id: number): Promise<User | null> => {
  if (!db) return null;
  const row = db.getFirstSync("SELECT * FROM users WHERE id = ?;", [
    id,
  ]) as UserRow | null;
  if (!row) return null;
  return { ...row, is_admin: row.is_admin === 1 };
};

export const checkUserAdminStatus = async (
  userId: number,
): Promise<boolean> => {
  if (!db) return false;
  const row = db.getFirstSync("SELECT is_admin FROM users WHERE id = ?;", [
    userId,
  ]) as { is_admin: number } | null;
  return row?.is_admin === 1;
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
): Promise<void> => {
  if (!db) throw new Error("DB não pronto");
  db.runSync("UPDATE users SET name = ?, email = ? WHERE id = ?;", [
    name,
    email,
    id,
  ]);
};

// --- Funções de Gerenciamento (Admin) ---
export const getAllUsers = async (): Promise<User[]> => {
  if (!db) return [];
  const rows = db.getAllSync(
    "SELECT id, name, email, is_admin, created_at FROM users ORDER BY name ASC;",
  ) as UserRow[];

  return rows.map((row) => ({
    ...row,
    is_admin: row.is_admin === 1,
  })) as User[];
};

export const deleteUser = async (id: number): Promise<void> => {
  if (!db) throw new Error("DB não pronto");
  db.runSync("DELETE FROM transactions WHERE user_id = ?;", [id]);
  db.runSync("DELETE FROM users WHERE id = ?;", [id]);
};

// --- Funções de Transação ---
export const addTransaction = async (
  transaction: Transaction,
): Promise<number> => {
  if (!db) throw new Error("DB não pronto");
  const result = db.runSync(
    "INSERT INTO transactions (label, value, type, date, category, user_id) VALUES (?, ?, ?, ?, ?, ?);",
    [
      transaction.label,
      transaction.value,
      transaction.type,
      transaction.date,
      transaction.category || "Outros",
      transaction.user_id,
    ],
  );
  return result.lastInsertRowId;
};

export const getTransactionsByUser = async (
  userId: number,
): Promise<Transaction[]> => {
  if (!db) return [];
  return db.getAllSync(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC;",
    [userId],
  ) as TransactionRow[];
};

export const deleteTransaction = async (id: number): Promise<void> => {
  if (!db) return;
  db.runSync("DELETE FROM transactions WHERE id = ?;", [id]);
};

// --- Funções de Orçamento (Budget) ---
export const setCategoryBudget = async (
  userId: number,
  category: string,
  limit: number,
): Promise<void> => {
  if (!db) throw new Error("DB não pronto");
  db.runSync(
    `INSERT INTO categories_budget (user_id, category_name, limit_value) 
     VALUES (?, ?, ?)
     ON CONFLICT(category_name, user_id) DO UPDATE SET limit_value = excluded.limit_value;`,
    [userId, category, limit],
  );
};

export const getBudgets = async (userId: number): Promise<any[]> => {
  if (!db) return [];
  return db.getAllSync(
    "SELECT category_name, limit_value FROM categories_budget WHERE user_id = ?;",
    [userId],
  );
};

export const getActiveCategories = async (
  userId: number,
): Promise<string[]> => {
  if (!db) return [];
  const rows = db.getAllSync(
    "SELECT category_name FROM categories_budget WHERE user_id = ?;",
    [userId],
  ) as { category_name: string }[];
  return rows.map((r) => r.category_name);
};

export const getBudgetEfficiency = async (userId: number): Promise<any[]> => {
  if (!db) return [];
  return db.getAllSync(
    `SELECT 
        b.category_name as name,
        b.limit_value as limitValue,
        COALESCE(SUM(t.value), 0) as totalSpent,
        CASE 
            WHEN b.limit_value > 0 THEN (COALESCE(SUM(t.value), 0) / b.limit_value) * 100 
            ELSE 0 
        END as percentage
    FROM categories_budget b
    LEFT JOIN transactions t ON b.category_name = t.category AND b.user_id = t.user_id AND t.type = 'expense'
    WHERE b.user_id = ? AND b.limit_value > 0  -- <--- ESTA LINHA IMPORTANTE FILTRA AS EXCLUÍDAS/ZERADAS
    GROUP BY b.category_name;`,
    [userId]
  );
};

// --- Estatísticas ---
export const getUserStats = async (userId: number): Promise<any> => {
  if (!db) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0,
    };
  }

  const stats = db.getFirstSync(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN value ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN value ELSE 0 END), 0) as total_expense,
      COUNT(*) as transaction_count
     FROM transactions WHERE user_id = ?;`,
    [userId],
  ) as StatsRow;

  return {
    totalIncome: stats.total_income,
    totalExpense: stats.total_expense,
    balance: stats.total_income - stats.total_expense,
    transactionCount: stats.transaction_count,
  };
};

// --- Manutenção e Exportação ---
export const exportDatabase = async () => {
  if (Platform.OS === "web") return;
  try {
    const baseDir = (FileSystem as any).documentDirectory;
    const dbUri = `${baseDir}SQLite/financas.db`;
    const fileInfo = await FileSystem.getInfoAsync(dbUri);

    if (!fileInfo.exists) {
      alert("Banco não encontrado. Crie um registro primeiro.");
      return;
    }

    await Sharing.shareAsync(dbUri, {
      mimeType: "application/x-sqlite3",
      dialogTitle: "Exportar Banco de Dados",
    });
  } catch (error) {
    console.error("Erro ao exportar:", error);
  }
};

export default db;
