<<<<<<< Updated upstream
import React, { useEffect, useState } from "react"; // Adicionei React aqui
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Alert 
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { 
  getTransactionsByUser, 
  getUserStats, 
  addTransaction, 
  deleteTransaction, 
  Transaction 
} from "../../database/database";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function Home() {
  // CORREÇÃO 1: Apenas uma chamada ao useAuth
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  
=======
import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
// Certifique-se de que deleteTransaction e addTransaction estão exportados do seu database
import { 
  getTransactionsByUser, 
  getUserStats, 
  deleteTransaction, 
  addTransaction, 
  Transaction 
} from "../../database/database";

export default function Home() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados faltantes para o formulário de nova transação
>>>>>>> Stashed changes
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('income');

<<<<<<< Updated upstream
=======
  // Função de carregamento centralizada
>>>>>>> Stashed changes
  async function loadData() {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [userTransactions, userStats] = await Promise.all([
        getTransactionsByUser(user.id),
        getUserStats(user.id)
      ]);
      setTransactions(userTransactions);
      setStats(userStats);
    } catch (error) {
<<<<<<< Updated upstream
      console.error("Erro ao carregar dados:", error);
=======
      console.error("Erro ao carregar dados da Home:", error);
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

<<<<<<< Updated upstream
  // CORREÇÃO 2: Função handleLogout movida para fora do IF de loading
  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: () => {
            signOut();
            router.replace('/auth/index'); // Ajuste o caminho conforme sua pasta
          } 
        }
      ]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      await loadData();
      Alert.alert("Sucesso", "Transação removida.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir.");
=======
  const handleDelete = async (id: number) => {
    Alert.alert("Excluir", "Deseja realmente excluir esta transação?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteTransaction(id);
            await loadData(); 
            console.log("Deletado com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        }
      }
    ]);
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

      setLabel("");
      setValue("");
      setModalVisible(false);
      await loadData();
      Alert.alert("Sucesso", "Transação adicionada!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
>>>>>>> Stashed changes
    }
  };

  // CORREÇÃO 3: Chave fechada corretamente no ActivityIndicator
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#032ad7" />;
  }

  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      {/* Cabeçalho atualizado com botão de logout */}
=======
>>>>>>> Stashed changes
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Seu saldo atual:</Text>
        <Text style={styles.balanceValue}>
          R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.incomeText}>Entradas</Text>
          <Text style={styles.summaryValue}>R$ {stats.totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.expenseText}>Saídas</Text>
          <Text style={styles.summaryValue}>R$ {stats.totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Atividades recentes</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.transactionItem} 
            onLongPress={() => handleDelete(item.id!)}
          >
            <Text style={styles.transactionLabel}>{item.label}</Text>
<<<<<<< Updated upstream
            <TouchableOpacity onPress={() => handleDelete(item.id!)}>
              <Text style={item.type === 'income' ? styles.incomeText : styles.expenseText}>
                {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
=======
            <Text style={item.type === 'income' ? styles.incomeText : styles.expenseText}>
              {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
            </Text>
          </TouchableOpacity>
>>>>>>> Stashed changes
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço para não cobrir o FAB
      />

<<<<<<< Updated upstream
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("Abrir Modal")}>
=======
      {/* O botão FAB deve ficar dentro do View principal do return */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
>>>>>>> Stashed changes
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F5" },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8F9FE',
  },
  greeting: { fontSize: 14, color: '#71717A' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1E' },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceContainer: { padding: 20 },
  balanceLabel: { fontSize: 16, color: "#71717A" },
  balanceValue: { fontSize: 32, fontWeight: "900", color: "#1A1A1E" },
  summaryContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 20,
    marginBottom: 20 
  },
  summaryItem: { 
    backgroundColor: "#FFF", 
    padding: 15, 
    borderRadius: 12, 
    width: "48%",
    elevation: 1 
  },
  summaryValue: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  incomeText: { color: "#10B981", fontWeight: "bold" },
  expenseText: { color: "#EF4444", fontWeight: "bold" },
  listTitle: { fontSize: 18, fontWeight: "bold", marginHorizontal: 20, marginBottom: 15 },
  transactionItem: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    backgroundColor: "#FFF", 
    padding: 15, 
    borderRadius: 12, 
    marginHorizontal: 20,
    marginBottom: 10 
  },
  transactionLabel: { fontSize: 16, color: "#1A1A1E" },
  emptyText: { textAlign: "center", color: "#71717A", marginTop: 20 },
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
});