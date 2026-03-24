// ========== EXEMPLO DE USO DO BANCO DE DADOS ==========
// Este arquivo mostra como usar as funções do SQLite no seu app

import {
  createTransaction,
  createUser,
  getTransactionsByUser,
  getUserByEmail,
  getUserStats,
  initDatabase
} from './database';

// ========== EXEMPLO DE INICIALIZAÇÃO ==========
// Execute isso quando o app iniciar (no App.tsx ou _layout.tsx)

export const initializeApp = async () => {
  try {
    await initDatabase();
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
};

// ========== EXEMPLO DE CADASTRO DE USUÁRIO ==========
export const exampleCreateUser = async () => {
  try {
    const userData = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
      is_admin: false
    };

    const userId = await createUser(userData);
    console.log('Usuário criado com ID:', userId);
    return userId;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

// ========== EXEMPLO DE LOGIN ==========
export const exampleLogin = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email);

    if (user && user.password === password) {
      console.log('Login bem-sucedido:', user.name);
      return user;
    } else {
      console.log('Credenciais inválidas');
      return null;
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return null;
  }
};

// ========== EXEMPLO DE CRIAR TRANSAÇÃO ==========
export const exampleCreateTransaction = async (userId: number) => {
  try {
    const transactionData = {
      label: 'Salário',
      value: 3000.00,
      type: 'income' as const,
      date: '2024-01-15',
      user_id: userId
    };

    const transactionId = await createTransaction(transactionData);
    console.log('Transação criada com ID:', transactionId);
    return transactionId;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
  }
};

// ========== EXEMPLO DE BUSCAR TRANSAÇÕES ==========
export const exampleGetTransactions = async (userId: number) => {
  try {
    const transactions = await getTransactionsByUser(userId);
    console.log('Transações encontradas:', transactions.length);

    transactions.forEach(transaction => {
      console.log(`${transaction.type}: ${transaction.label} - R$ ${transaction.value}`);
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
  }
};

// ========== EXEMPLO DE ESTATÍSTICAS ==========
export const exampleGetStats = async (userId: number) => {
  try {
    const stats = await getUserStats(userId);
    console.log('Estatísticas:');
    console.log('Receitas:', stats.totalIncome);
    console.log('Despesas:', stats.totalExpense);
    console.log('Saldo:', stats.balance);
    console.log('Total de transações:', stats.transactionCount);

    return stats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
  }
};

// ========== EXEMPLO COMPLETO DE USO ==========
export const exampleCompleteFlow = async () => {
  try {
    // 1. Inicializar banco
    await initializeApp();

    // 2. Criar usuário
    const userId = await exampleCreateUser();

    if (userId) {
      // 3. Criar algumas transações
      await exampleCreateTransaction(userId);

      const expenseTransaction = {
        label: 'Conta de luz',
        value: 150.00,
        type: 'expense' as const,
        date: '2024-01-16',
        user_id: userId
      };
      await createTransaction(expenseTransaction);

      // 4. Buscar transações
      await exampleGetTransactions(userId);

      // 5. Ver estatísticas
      await exampleGetStats(userId);
    }

    console.log('Fluxo completo executado com sucesso!');
  } catch (error) {
    console.error('Erro no fluxo completo:', error);
  }
};

// ========== DICAS DE USO ==========
/*
1. Sempre inicialize o banco no início do app:
   - No _layout.tsx ou App.tsx, chame: await initDatabase();

2. Use async/await para todas as operações do banco:
   - const user = await getUserByEmail('email@example.com');

3. Trate erros adequadamente:
   - Use try/catch em todas as operações

4. Para dados complexos, considere usar JSON.stringify/parse:
   - Se precisar armazenar objetos complexos

5. Performance:
   - Use índices para campos frequentemente consultados
   - Evite queries muito grandes
   - Considere paginação para listas grandes

6. Segurança:
   - Nunca armazene senhas em texto plano (use hash)
   - Valide dados antes de inserir
   - Use prepared statements (já implementado)

7. Migrações:
   - Para alterar estrutura, crie novas versões das tabelas
   - Ou use ALTER TABLE com cuidado
*/