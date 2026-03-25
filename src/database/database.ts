import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite'

const isWeb = Platform.OS === 'web';

let db: SQLite.SQLiteDatabase | null = null;

async function openDb() {
  if (isWeb) return null;
  if (db) return db;

  const SQLite = await import('expo-sqlite');
  db = SQLite.openDatabaseSync('financas.db');
  return db;
}

// Interface para as transações
export interface Transaction {
  id?: number;
  label: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  user_id: number;
}

// Interface para linhas brutas da transação (do SQLite)
interface TransactionRow {
  id: number;
  label: string;
  value: number;
  type: string;
  date: string;
  user_id: number;
}

// Interface para linhas brutas de estatísticas (do SQLite)
interface StatsRow {
  total_income: number;
  total_expense: number;
  transaction_count: number;
}

// Interface para usuários
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: string;
}

// Interface para linhas brutas do usuário (do SQLite)
interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  is_admin: number;
  created_at: string;
}

// Inicializar tabelas
export const initDatabase = async () => {
  if (isWeb) {
    console.warn('SQLite não está disponível no web. Usando modo de compatibilidade somente leitura.');
    return;
  }

  const database = await openDb();
  if (!database) throw new Error('Banco de dados não inicializado.');

  return new Promise<void>((resolve, reject) => {
    try {
      db = database;
      // Criar tabela de usuários
      db.runSync(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          is_admin BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
      console.log('Tabela users criada com sucesso');

      // Criar tabela de transações
      db.runSync(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT NOT NULL,
          value REAL NOT NULL,
          type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
          date TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );`
      );
      console.log('Tabela transactions criada com sucesso');

      // Criar índices para melhor performance
      db.runSync('CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);');
      console.log('Índice criado com sucesso');

      db.runSync('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);');
      console.log('Índice de data criado com sucesso');

      console.log('Banco de dados inicializado com sucesso!');
      resolve();
    } catch (error) {
      console.error('Erro na transação de inicialização:', error);
      reject(error);
    }
  });
};

// ========== FUNÇÕES PARA USUÁRIOS ==========

// Criar usuário
export const createUser = (user: Omit<User, 'id' | 'created_at'>) => {
  return new Promise<number>((resolve, reject) => {
    if (isWeb) {
      reject(new Error('Criação de usuário não suportada no web (use mobile).'));
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const result = db.runSync(
        'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?);',
        [user.name, user.email, user.password, user.is_admin ? 1 : 0]
      );
      if (result.lastInsertRowId) {
        resolve(result.lastInsertRowId);
      } else {
        reject(new Error('Falha ao inserir usuário'));
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      reject(error);
    }
  });
};

// Buscar usuário por email
export const getUserByEmail = (email: string) => {
  return new Promise<User | null>((resolve, reject) => {
    if (isWeb) {
      resolve(null);
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const userRow = db.getFirstSync(
        'SELECT * FROM users WHERE email = ?;',
        [email]
      ) as UserRow | null;
      if (userRow) {
        resolve({
          id: userRow.id,
          name: userRow.name,
          email: userRow.email,
          password: userRow.password,
          is_admin: userRow.is_admin === 1,
          created_at: userRow.created_at
        });
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      reject(error);
    }
  });
};

// Buscar todos os usuários
export const getAllUsers = () => {
  return new Promise<User[]>((resolve, reject) => {
    if (isWeb) {
      resolve([]);
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const rows = db.getAllSync(
        'SELECT * FROM users ORDER BY created_at DESC;'
      ) as UserRow[];
      const users: User[] = rows.map(userRow => ({
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        password: userRow.password,
        is_admin: userRow.is_admin === 1,
        created_at: userRow.created_at
      }));
      resolve(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      reject(error);
    }
  });
};

// Atualizar usuário
export const updateUser = (id: number, user: Partial<Omit<User, 'id' | 'created_at'>>) => {
  return new Promise<void>((resolve, reject) => {
    if (isWeb) {
      resolve();
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (user.name !== undefined) {
        updates.push('name = ?');
        values.push(user.name);
      }
      if (user.email !== undefined) {
        updates.push('email = ?');
        values.push(user.email);
      }
      if (user.password !== undefined) {
        updates.push('password = ?');
        values.push(user.password);
      }
      if (user.is_admin !== undefined) {
        updates.push('is_admin = ?');
        values.push(user.is_admin ? 1 : 0);
      }

      if (updates.length === 0) {
        resolve();
        return;
      }

      values.push(id);

      db.runSync(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );
      resolve();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      reject(error);
    }
  });
};

// Deletar usuário
export const deleteUser = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    if (isWeb) {
      resolve();
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      db.runSync(
        'DELETE FROM users WHERE id = ?;',
        [id]
      );
      resolve();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      reject(error);
    }
  });
};

// ========== FUNÇÕES PARA TRANSAÇÕES ==========

// Criar transação (Renomeada para addTransaction para alinhar com a Home)
export const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
  return new Promise<number>(async (resolve, reject) => {
    if (isWeb) {
      reject(new Error('Criação de transação não suportada no web (use mobile).'));
      return;
    }

    // Usando a sua função openDb já existente no arquivo
    const database = await openDb();

    if (!database) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }

    try {
      const result = database.runSync(
        'INSERT INTO transactions (label, value, type, date, user_id) VALUES (?, ?, ?, ?, ?);',
        [transaction.label, transaction.value, transaction.type, transaction.date, transaction.user_id]
      );

      if (result.lastInsertRowId) {
        resolve(result.lastInsertRowId);
      } else {
        reject(new Error('Falha ao inserir transação'));
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      reject(error);
    }
  });
};

// Mantenha a createTransaction como um apelido (alias) para não quebrar outros arquivos caso existam
export const createTransaction = addTransaction;

// Buscar transações por usuário (Mantenha como você já tem no arquivo...)
export const getTransactionsByUser = (userId: number) => {
// ... resto do seu código igual
  return new Promise<Transaction[]>((resolve, reject) => {
    if (isWeb) {
      resolve([]);
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const rows = db.getAllSync(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC;',
        [userId]
      ) as TransactionRow[];
      const transactions: Transaction[] = rows.map(transactionRow => ({
        id: transactionRow.id,
        label: transactionRow.label,
        value: transactionRow.value,
        type: transactionRow.type as 'income' | 'expense',
        date: transactionRow.date,
        user_id: transactionRow.user_id
      }));
      resolve(transactions);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      reject(error);
    }
  });
};

// Buscar transação por ID
export const getTransactionById = (id: number) => {
  return new Promise<Transaction | null>((resolve, reject) => {
    if (isWeb) {
      resolve(null);
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const transactionRow = db.getFirstSync(
        'SELECT * FROM transactions WHERE id = ?;',
        [id]
      ) as TransactionRow | null;
      if (transactionRow) {
        resolve({
          id: transactionRow.id,
          label: transactionRow.label,
          value: transactionRow.value,
          type: transactionRow.type as 'income' | 'expense',
          date: transactionRow.date,
          user_id: transactionRow.user_id
        });
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      reject(error);
    }
  });
};

// Atualizar transação
export const updateTransaction = (id: number, transaction: Partial<Omit<Transaction, 'id' | 'user_id'>>) => {
  return new Promise<void>((resolve, reject) => {
    if (isWeb) {
      resolve();
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (transaction.label !== undefined) {
        updates.push('label = ?');
        values.push(transaction.label);
      }
      if (transaction.value !== undefined) {
        updates.push('value = ?');
        values.push(transaction.value);
      }
      if (transaction.type !== undefined) {
        updates.push('type = ?');
        values.push(transaction.type);
      }
      if (transaction.date !== undefined) {
        updates.push('date = ?');
        values.push(transaction.date);
      }

      if (updates.length === 0) {
        resolve();
        return;
      }

      values.push(id);

      db.runSync(
        `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );
      resolve();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      reject(error);
    }
  });
};

// Deletar transação
export const deleteTransaction = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    if (isWeb) {
      resolve();
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      db.runSync(
        'DELETE FROM transactions WHERE id = ?;',
        [id]
      );
      resolve();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      reject(error);
    }
  });
};

// ========== FUNÇÕES DE ESTATÍSTICAS ==========

// Obter estatísticas do usuário
export const getUserStats = (userId: number) => {
  return new Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }>((resolve, reject) => {
    if (isWeb) {
      resolve({ totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 });
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      const statsRow = db.getFirstSync(
        `SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN value ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN value ELSE 0 END), 0) as total_expense,
          COUNT(*) as transaction_count
          FROM transactions WHERE user_id = ?;`,
        [userId]
      ) as StatsRow | null;
      if (statsRow) {
        const totalIncome = statsRow.total_income;
        const totalExpense = statsRow.total_expense;
        const balance = totalIncome - totalExpense;
        const transactionCount = statsRow.transaction_count;

        resolve({
          totalIncome,
          totalExpense,
          balance,
          transactionCount
        });
      } else {
        resolve({
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          transactionCount: 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      reject(error);
    }
  });
};

// ========== FUNÇÕES DE MANUTENÇÃO ==========

// Limpar todas as tabelas (usar com cuidado!)
export const clearAllData = () => {
  return new Promise<void>((resolve, reject) => {
    if (isWeb) {
      resolve();
      return;
    }
    if (!db) {
      reject(new Error('Banco de dados não inicializado.'));
      return;
    }
    try {
      db.runSync('DELETE FROM transactions;');
      db.runSync('DELETE FROM users;');
      db.runSync('DELETE FROM sqlite_sequence WHERE name IN ("users", "transactions");');
      console.log('Dados limpos com sucesso!');
      resolve();
    } catch (error) {
      console.error('Erro na limpeza:', error);
      reject(error);
    }
  });
};

// Fechar conexão com o banco (opcional)
export const closeDatabase = () => {
  if (isWeb || !db) return;
  db.closeAsync();
};

export default db;

export async function getDatabase() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('financas.db');
  return db;
}