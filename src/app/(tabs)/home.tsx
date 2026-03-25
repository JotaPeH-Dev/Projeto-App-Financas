import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getTransactionsByUser, getUserStats, Transaction } from "../../database/database";

export default function Home() {
  const { user } = useAuth();
  const [transactions, setTransactions,] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        // Busca as transações e estatísticas em paralelo
        const [userTransactions, userStats] = await Promise.all([
          getTransactionsByUser(user.id),
          getUserStats(user.id)
        ]);

        setTransactions(userTransactions);
        setStats(userStats);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    loadData();
  }, [user]);
  const handleDelete = async (id: number) => {
  try {
    // Chama a função que você acabou de me mostrar
    await deleteTransaction(id);
    
    // Atualiza a lista e o saldo na tela
    await loadData(); 
    
    console.log("Transação deletada com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar:", error);
    Alert.alert("Erro", "Não foi possível excluir a transação.");
  }
};

  const handleSave = async () => {
    if (!label || !value || !user?.id) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const numericValue = parseFloat(value.replace(',', '.'));

      await addTransaction({
        user_id: user.id,
        label,
        value: numericValue,
        type,
        date: new Date().toISOString()
      });

      // Limpa e fecha
      setLabel("");
      setValue("");
      setModalVisible(false);

      // Recarrega a lista e o saldo
      await loadData();

      Alert.alert("Sucesso", "Transação adicionada!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#032ad7" />;
  }
  <TouchableOpacity 
  style={styles.fab} 
  onPress={() => setModalVisible(true)}
>
  <Text style={styles.fabIcon}>+</Text>
  </TouchableOpacity>
  return (
    <View style={styles.container}>
      {/* Header com Nome do Usuário */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name}!</Text>
        <Text style={styles.balanceLabel}>Seu saldo atual:</Text>
        <Text style={styles.balanceValue}>
          R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Resumo (Entradas/Saídas) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.incomeText}>Entradas</Text>
          <Text>R$ {stats.totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.expenseText}>Saídas</Text>
          <Text>R$ {stats.totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Atividades recentes</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionLabel}>{item.label}</Text>
            <Text style={item.type === 'income' ? styles.incomeText : styles.expenseText}>
              {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#F4F4F5",
      padding: 20 
    },
  header: { 
    marginTop: 40,
    marginBottom: 20 
    },
  greeting: { 
    fontSize: 24,
    fontWeight: "bold" 
    },
  balanceLabel: { 
    fontSize: 16,
    color: "#71717A",
    marginTop: 10 
    },
  balanceValue: { 
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1E" 
    },
  summaryContainer: { 
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30 
    },
  summaryItem: { 
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    width: "48%" 
      },
  incomeText: {
    color: "#10B981",
    fontWeight: "bold" 
  },
  expenseText: {
    color: "#EF4444",
    fontWeight: "bold" 
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15 
  },
  transactionItem: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    backgroundColor: "#FFF", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10 
  },
  transactionLabel: {
    fontSize: 16,
    color: "#1A1A1E"
  },
  emptyText: {
    textAlign: "center",
    color: "#71717A",
    marginTop: 20 
  },
  fab: {
  position: 'absolute',
  right: 20,
  bottom: 30,
  backgroundColor: '#311de1',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 8, // Sombra no Android
  shadowColor: '#000', // Sombra no iOS
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
fabIcon: {
  color: '#FFF',
  fontSize: 30,
  fontWeight: 'bold',
},
});