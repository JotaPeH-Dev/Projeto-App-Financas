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
  ViewStyle,
  Keyboard } from "react-native";
import BalanceCard from "@/Components/BalanceCard";
import TransactionsItem from "@/Components/TransactionsItem";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

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
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

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

const handleDeleteTransaction = (id: string) => {
  console.log("CLIQUE CONFIRMADO no ID:", id);

  // Vamos deletar direto SEM o Alert para testar a lógica
  setTransactions(prev => {
    const novaLista = prev.filter(item => item.id !== id);
    console.log("Lista atualizada! Novo tamanho:", novaLista.length);
    return novaLista;
  });
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

const handleDateChange = (text: string) => {
  // Remove tudo que não for número
  let cleaned = text.replace(/\D/g, "");

  // Limita a 8 dígitos (DDMMYYYY)
  if (cleaned.length > 8) {
    cleaned = cleaned.slice(0, 8);
  }

  // Aplica a máscara progressivamente
  let formatted = cleaned;
  if (cleaned.length > 2) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }

  setNewDate(formatted);
};

if (loading) return null;

const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((sum: number, t) => sum + t.value, 0);
const totalExpense = transactions
  .filter((t) => t.type === "expense")
  .reduce((sum: number, t) => sum + t.value, 0);
const balance = totalIncome - totalExpense;

const chartData = [
  { name: "Receitas",
    population: totalIncome,
    color: "#311de1",
    legendFontColor: "#71717A",
    legendFontSize: 12
  },
  { name: "Despesas",
    population: totalExpense,
    color: "#EF4444",
    legendFontColor: "#71717A",
    legendFontSize: 12
  }
];
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name}!</Text>
      <Text style={styles.subtitle}>Bem-vindo ao seu controle financeiro.</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    marginTop: 8,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});