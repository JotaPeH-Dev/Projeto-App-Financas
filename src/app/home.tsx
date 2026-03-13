import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, 
  Modal, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ViewStyle } from "react-native";
import BalanceCard from "@/Components/BalanceCard";
import TransactionsItem from "@/Components/TransactionsItem";

const DATA_KEY = "@myfinances:transactions";

type Transaction = {
  id: string;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
};

// ... (mantenha os imports iguais)

export default function Home() {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("income");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR DADOS AO ABRIR
  useEffect(() => {
    async function loadTransactions() {
      try {
        const value = await AsyncStorage.getItem(DATA_KEY);
        if (value !== null) {
          setTransactions(JSON.parse(value));
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  // 2. SALVAR DADOS SEMPRE QUE A LISTA MUDAR
  useEffect(() => {
  const saveTransactions = async () => {
    // Adicione esse log para ver EXATAMENTE quando o salvamento é tentado
    console.log("Tentando persistir no AsyncStorage...", { 
      loading, 
      count: transactions.length 
    });

    if (!loading) {
      try {
        const jsonValue = JSON.stringify(transactions);
        await AsyncStorage.setItem(DATA_KEY, jsonValue);
        console.log("✅ Salvo com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao salvar:", error);
      }
    }
  };

  saveTransactions();
}, [transactions, loading]);

  const addTransaction = () => {
    if (!newLabel || !newValue || !newDate) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    const value = parseFloat(newValue);
    if (isNaN(value)) {
      Alert.alert("Erro", "Valor deve ser um número.");
      return;
    }

    // ID único baseado no tempo para evitar duplicatas
    const newId = Date.now().toString();
    
    const newTransaction: Transaction = { 
      id: newId, 
      label: newLabel, 
      value, 
      type: newType as "income" | "expense", 
      date: newDate 
    };

    setTransactions([...transactions, newTransaction]);
    
    // LIMPAR CAMPOS E FECHAR MODAL
    setNewLabel("");
    setNewValue("");
    setNewType("income");
    setNewDate("");
    setModalVisible(false);
  };

  if (loading) return null;

  // ... (restante das funções handleClearAll e handleDeleteTransaction iguais)
  // ... (return JSX igual)

  const handleDeleteTransaction = (id: string) => {
  console.log("ID recebido para deletar:", id);
  console.log("IDs existentes na lista:", transactions.map(t => t.id));

  Alert.alert(
    "Excluir Transação",
    "Tem certeza?",
    [
      { text: "Cancelar" },
      { 
        text: "Excluir", 
        onPress: () => {
          const novaLista = transactions.filter(t => t.id !== id);
          console.log("Tamanho antes:", transactions.length, "Tamanho depois:", novaLista.length);
          setTransactions(novaLista);
        } 
      }
    ]
  );
};
const handleClearAll = () => {
  Alert.alert(
    "Limpar Tudo",
    "Tem certeza que deseja remover todas as transações?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", style: "destructive", onPress: () => setTransactions([]) }
    ]
  );
};

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum: number, t) => sum + t.value, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum: number, t) => sum + t.value, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || "João Pedro"}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <BalanceCard
            saldo={balance}
            receitas={totalIncome}
            despesas={totalExpense}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.title}>Últimas Transações</Text>
            {transactions.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.ClearButtonText}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
          </View>

          {transactions.length > 0 ? (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionWrapper}>
                <View style={{ flex: 1 }}>
                  <TransactionsItem
                    label={item.label}
                    value={item.value}
                    type={item.type}
                    date={item.date}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteTransaction(item.id)}
                  style={styles.deleteIconButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Transação</Text>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#A1A1AA"
              value={newLabel}
              onChangeText={setNewLabel}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor (ex: 50.00)"
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={newValue}
              onChangeText={setNewValue}
            />

            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/AAAA)"
              placeholderTextColor="#A1A1AA"
              value={newDate}
              onChangeText={setNewDate}
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, newType === 'income' && styles.typeButtonSelected]}
                onPress={() => setNewType('income')}
              >
                <Text style={[styles.typeButtonText, newType === 'income' && { color: "#FFF" }]}>
                  Receita
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, newType === 'expense' && styles.typeButtonSelected]}
                onPress={() => setNewType('expense')}
              >
                <Text style={[styles.typeButtonText, newType === 'expense' && { color: "#FFF" }]}>
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#311de1' }]} 
              onPress={addTransaction}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ marginTop: 15, alignItems: 'center' }} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000"
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 20
  },
  greeting: {
    fontSize: 16,
    color: "#71717A"
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FEFEFE"
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "#311de1", 
    borderRadius: 8
  },
  logoutText: {
    color: "#e4e3e7",
    fontWeight: "600"
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 24
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b4b4b4"
  },
  emptyText: {
    textAlign: "center",
    color: "#71717A",
    marginTop: 20,
    fontStyle: "italic"
  },
  transactionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#311de1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    zIndex: 99,
  },
  fabText: {
    fontSize: 34,
    color: "#FEFEFE",
    fontWeight: "300",
    transform: [{ translateY: -2 }],
  },
  deleteIconButton: {
    padding: 10,
    marginLeft: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "75%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1E",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#aeafb1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#000"
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#311de1",
    alignItems: "center",
    marginHorizontal: 4
  },
  typeButtonSelected: {
    backgroundColor: "#311de1",
    borderColor: "#311de1"
  },
  typeButtonText: {
    color: "#311de1",
    fontWeight: "600"
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#ebe3e3",
    fontWeight: "600",
    fontSize: 16
  },
  ClearButtonText: {
    color: "#71717A",
    fontWeight: "600",
    fontSize: 14
  },
});