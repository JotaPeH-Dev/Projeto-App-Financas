import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteTransaction,
  addTransaction,
  getTransactionsByUser,
  getUserStats, // Certifique-se que esta função existe no seu database.ts
  Transaction
} from "../../database/database";
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Home() {
  const { user } = useAuth();
  const [transactions, setTransactions,] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados do Formulário
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('income');

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
      console.error("Erro ao carregar dados:", error);
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

  return (
    <View style={styles.container}>
      {/* Cabeçalho e Resumo (Mantidos) */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name}!</Text>
        <Text style={styles.balanceLabel}>Seu saldo atual:</Text>
        <Text style={styles.balanceValue}>
          R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

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
    /* 1. O Swipeable envolve todo o conteúdo do item */
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        /* 2. Este é o botão que aparece ao deslizar da direita para a esquerda */
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item.id!)}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      )}
    >
      /* 3. Seu código original do card de transação */
      <View style={styles.transactionItem}>
        <Text style={styles.transactionLabel}>{item.label}</Text>
        <Text style={item.type === 'income' ? styles.incomeText : styles.expenseText}>
          {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
        </Text>
      </View>
    </Swipeable>
  )}
  ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
/>

      {/* MODAL DE CADASTRO */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Transação</Text>

            <TextInput
              style={styles.input}
              placeholder="Descrição (ex: Aluguel)"
              value={label}
              onChangeText={setLabel}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor (ex: 150.00)"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'income' && styles.typeBtnSelected]}
                onPress={() => setType('income')}
              >
                <Text>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'expense' && styles.typeBtnSelectedExpense]}
                onPress={() => setType('expense')}
              >
                <Text>Saída</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#71717A', marginTop: 15 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTÃO FLUTUANTE */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Mantenha seus estilos anteriores e adicione estes novos)
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
    elevation: 8
  },
  fabIcon: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold'
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  typeBtn: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DDD',
    borderRadius: 10,
    marginHorizontal: 5
  },
  typeBtnSelected: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981'
  },
  typeBtnSelectedExpense: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444'
  },
  saveBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#311de1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButton: {
  backgroundColor: '#EF4444',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,          // Largura fixa é importante!
  height: 60,          // Deve ser a mesma altura do seu card
  borderRadius: 12,
  marginLeft: 10,      // Espaço entre o card e o botão
},
deleteText: {
  color: '#FFF',
  fontWeight: 'bold',
},
});