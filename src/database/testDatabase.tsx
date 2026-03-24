// ========== TESTE DO BANCO DE DADOS ==========
// Execute este arquivo para testar se o SQLite está funcionando

import {
  clearAllData,
  createTransaction,
  createUser,
  getAllUsers,
  getTransactionsByUser,
  getUserByEmail,
  getUserStats,
  initDatabase
} from './database';

export const testDatabase = async () => {
  try {
    console.log('🧪 Iniciando testes do banco de dados...\n');

    // 1. Inicializar banco
    console.log('1️⃣ Inicializando banco...');
    await initDatabase();
    console.log('✅ Banco inicializado!\n');

    // 2. Limpar dados antigos
    console.log('2️⃣ Limpando dados antigos...');
    await clearAllData();
    console.log('✅ Dados limpos!\n');

    // 3. Criar usuário de teste
    console.log('3️⃣ Criando usuário de teste...');
    const userId = await createUser({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      password: '123456',
      is_admin: true
    });
    console.log('✅ Usuário criado com ID:', userId, '\n');

    // 4. Verificar se usuário foi criado
    console.log('4️⃣ Verificando criação do usuário...');
    const user = await getUserByEmail('teste@email.com');
    console.log('✅ Usuário encontrado:', user?.name, '\n');

    // 5. Criar transações de teste
    console.log('5️⃣ Criando transações de teste...');
    await createTransaction({
      label: 'Salário',
      value: 5000.00,
      type: 'income',
      date: '2024-01-01',
      user_id: userId
    });

    await createTransaction({
      label: 'Aluguel',
      value: 1200.00,
      type: 'expense',
      date: '2024-01-02',
      user_id: userId
    });

    await createTransaction({
      label: 'Supermercado',
      value: 300.00,
      type: 'expense',
      date: '2024-01-03',
      user_id: userId
    });
    console.log('✅ Transações criadas!\n');

    // 6. Buscar transações
    console.log('6️⃣ Buscando transações...');
    const transactions = await getTransactionsByUser(userId);
    console.log('✅ Transações encontradas:', transactions.length);
    transactions.forEach(t => {
      console.log(`   - ${t.type}: ${t.label} - R$ ${t.value}`);
    });
    console.log('');

    // 7. Verificar estatísticas
    console.log('7️⃣ Verificando estatísticas...');
    const stats = await getUserStats(userId);
    console.log('✅ Estatísticas:');
    console.log(`   - Receitas: R$ ${stats.totalIncome}`);
    console.log(`   - Despesas: R$ ${stats.totalExpense}`);
    console.log(`   - Saldo: R$ ${stats.balance}`);
    console.log(`   - Total de transações: ${stats.transactionCount}\n`);

    // 8. Listar todos os usuários
    console.log('8️⃣ Listando todos os usuários...');
    const allUsers = await getAllUsers();
    console.log('✅ Usuários cadastrados:', allUsers.length);
    allUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.email}) - Admin: ${u.is_admin ? 'Sim' : 'Não'}`);
    });

    console.log('\n🎉 Todos os testes passaram! SQLite está funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
};

// ========== COMO EXECUTAR O TESTE ==========
// 1. Importe este arquivo em algum componente
// 2. Chame a função: await testDatabase()
// 3. Verifique o console para ver os resultados

// Exemplo de uso em um componente React:
export const TestButton = () => {
  const runTests = async () => {
    await testDatabase();
  };

  return (
    <button onClick={runTests} >
      Executar Testes do Banco
    </button>
  );
};