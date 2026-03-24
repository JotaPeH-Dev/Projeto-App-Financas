# 📱 SQLite no React Native (Expo)

Este projeto agora usa **SQLite** como banco de dados local para armazenar usuários e transações de forma persistente e estruturada.

## 🚀 Instalação

```bash
npm install expo-sqlite
```

## 📁 Estrutura do Banco

### Tabelas Criadas

#### `users` - Usuários
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `transactions` - Transações
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  value REAL NOT NULL,
  type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
  date TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔧 Como Usar

### 1. Inicialização
```typescript
import { initDatabase } from './src/database/database';

// No _layout.tsx ou App.tsx
await initDatabase();
```

### 2. Operações com Usuários
```typescript
import {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser
} from './src/database/database';

// Criar usuário
const userId = await createUser({
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123',
  is_admin: false
});

// Buscar usuário
const user = await getUserByEmail('joao@email.com');

// Listar todos
const users = await getAllUsers();
```

### 3. Operações com Transações
```typescript
import {
  createTransaction,
  getTransactionsByUser,
  updateTransaction,
  deleteTransaction,
  getUserStats
} from './src/database/database';

// Criar transação
const transactionId = await createTransaction({
  label: 'Salário',
  value: 3000.00,
  type: 'income',
  date: '2024-01-15',
  user_id: 1
});

// Buscar transações do usuário
const transactions = await getTransactionsByUser(1);

// Obter estatísticas
const stats = await getUserStats(1);
// { totalIncome: 3000, totalExpense: 150, balance: 2850, transactionCount: 2 }
```

## 🔄 Integração com o App

### AuthContext Atualizado
- ✅ Login e cadastro agora usam SQLite
- ✅ Dados persistentes entre sessões
- ✅ Suporte a múltiplos usuários
- ✅ Primeiro usuário é automaticamente admin

### Funcionalidades
- 🔐 **Autenticação**: Login/cadastro com SQLite
- 👥 **Múltiplos usuários**: Cada um com suas transações
- 📊 **Estatísticas**: Cálculos automáticos por usuário
- 🛡️ **Admin**: Controle de usuários (editar/deletar)

## 📋 Scripts Úteis

### Limpar dados (cuidado!)
```typescript
import { clearAllData } from './src/database/database';
await clearAllData(); // Remove tudo!
```

### Ver dados no console
```typescript
import { getAllUsers, getTransactionsByUser } from './src/database/database';

const users = await getAllUsers();
console.log('Usuários:', users);

const transactions = await getTransactionsByUser(1);
console.log('Transações:', transactions);
```

## 🔍 Estrutura de Arquivos

```
src/
├── database/
│   ├── database.ts          # Funções principais do banco
│   └── databaseExample.ts   # Exemplos de uso
├── contexts/
│   └── AuthContext.tsx      # Autenticação integrada
└── app/
    ├── auth/
    │   ├── index.tsx        # Login
    │   └── signup.tsx       # Cadastro
    └── (tabs)/
        ├── home.tsx         # Dashboard
        └── admin.tsx        # Painel admin
```

## ⚡ Vantagens do SQLite

- 🚀 **Performance**: Muito rápido para dados locais
- 💾 **Persistente**: Dados sobrevivem ao fechamento do app
- 🔍 **SQL**: Consultas poderosas e flexíveis
- 📱 **Cross-platform**: Funciona em iOS, Android e Web
- 🔒 **Transações**: Operações seguras e atômicas
- 📊 **Relacionamentos**: Suporte a chaves estrangeiras

## 🛠️ Desenvolvimento

### Adicionar novas tabelas
1. Atualize a função `initDatabase()` em `database.ts`
2. Crie interfaces TypeScript para os novos dados
3. Implemente funções CRUD para a nova tabela

### Debugging
- Use `console.log()` nas funções do banco
- Verifique o console do Expo para erros SQL
- Teste em dispositivo físico para melhor performance

## 📚 Referências

- [Expo SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQL Tutorial](https://www.w3schools.com/sql/)

---

**Dica**: Sempre teste as operações do banco em um dispositivo físico, pois o SQLite pode se comportar diferente no simulador/emulador.