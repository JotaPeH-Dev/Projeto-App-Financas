import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, View
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import z from "zod";
import BalanceCard from "../../../Components/BalanceCard";
import TransactionsItem from "../../../Components/TransactionsItem";
import { useAuth } from "../../contexts/AuthContext";

const DATA_KEY = "@myfinances:transactions";
const screenWidth = Dimensions.get("window").width;

type Transaction = {
  id: string;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
};

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("income");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'outcome'>('all');

  // Efeito para preencher a data automática ao abrir o modal
  useEffect(() => {
    if (modalVisible) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('pt-BR');
      setNewDate(formattedDate);
    }
  }, [modalVisible]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const value = await AsyncStorage.getItem(DATA_KEY);
        if (value) setTransactions(JSON.parse(value));

        const allUsers = await AsyncStorage.getItem('@AllUsers');
        if (allUsers && user) {
          const users = JSON.parse(allUsers);
          const currentUser = users.find((u: any) => u.email === user.email);
          setIsAdmin(currentUser?.isAdmin || false);
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(DATA_KEY, JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  const addTransaction = () => {
    if (!newLabel || !newValue || !newDate) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    const val = parseFloat(newValue.replace(',', '.'));
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      label: newLabel,
      value: val,
      type: newType,
      date: newDate
    };
    setTransactions([newTransaction, ...transactions]);
    setModalVisible(false);
    setNewLabel(""); setNewValue(""); setNewType("income");
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.value, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.value, 0);
  const balance = totalIncome - totalExpense;

  // Lógica de filtragem da lista
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'income') return t.type === 'income';
    if (filter === 'outcome') return t.type === 'expense';
    return true;
  });

  const chartData = [
    { name: "Ganhos", population: totalIncome, color: "#12A454", legendFontColor: "#71717A", legendFontSize: 12 },
    { name: "Gastos", population: totalExpense, color: "#EF4444", legendFontColor: "#71717A", legendFontSize: 12 }
  ];

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  const handleDateChange = (text: string) => {
  // Remove tudo que não for número
  const cleaned = text.replace(/\D/g, "");
  
  // Aplica a máscara DD/MM/YYYY
  let formatted = cleaned;
  if (cleaned.length > 2) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }
  
  setNewDate(formatted);
  useEffect(() => {
  if (modalVisible && newDate === "") { // Só preenche se estiver vazio
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    setNewDate(formattedDate);
  }
}, [modalVisible]);
};
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Olá, {user?.name}!</Text>
            <Text style={styles.subtitle}>Seu resumo financeiro</Text>
          </View>
          <View style={styles.headerActions}>
            {isAdmin && (
              <TouchableOpacity style={styles.adminBtn} onPress={() => router.push('/(tabs)/admin')}>
                <Ionicons name="settings" size={24} color="#311de1" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={28} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterWrapper}>
          <TouchableOpacity
            style={[styles.filterCard, filter === 'income' && styles.filterCardActiveIncome]}
            onPress={() => setFilter(filter === 'income' ? 'all' : 'income')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E7F6ED' }]}>
              <Ionicons name="arrow-up" size={20} color="#12A454" />
            </View>
            <Text style={styles.filterLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterCard, filter === 'outcome' && styles.filterCardActiveOutcome]}
            onPress={() => setFilter(filter === 'outcome' ? 'all' : 'outcome')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FDECEC' }]}>
              <Ionicons name="arrow-down" size={20} color="#EF4444" />
            </View>
            <Text style={styles.filterLabel}>Despesas</Text>
          </TouchableOpacity>
        </View>

        <BalanceCard saldo={balance} receitas={totalIncome} despesas={totalExpense} />

        {transactions.length > 0 && (
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={screenWidth - 60}
              height={180}
              chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
            />
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filter === 'all' ? 'Últimas movimentações' : filter === 'income' ? 'Minhas Receitas' : 'Minhas Despesas'}
          </Text>
        </View>

        {filteredTransactions.map((item) => (
          <TransactionsItem
            key={item.id}
            data={item}
            onDelete={() => setTransactions(prev => prev.filter(t => t.id !== item.id))}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Transação</Text>
            
            <TextInput placeholder="Título" style={styles.input} value={newLabel} onChangeText={setNewLabel} />
            <TextInput placeholder="Valor" style={styles.input} keyboardType="numeric" value={newValue} onChangeText={setNewValue} />
            <TextInput placeholder="Data" style={[styles.input, { backgroundColor: '#f0f0f0' }]} value={newDate} editable={false} />

            <View style={styles.modalTypeContainer}>
              <TouchableOpacity 
                style={[styles.typeBtn, newType === 'income' && styles.typeBtnIncomeActive]} 
                onPress={() => setNewType('income')}
              >
                <Ionicons name="arrow-up-circle" size={20} color={newType === 'income' ? "#FFF" : "#12A454"} />
                <Text style={[styles.typeBtnText, newType === 'income' && { color: '#FFF' }]}>Receita</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.typeBtn, newType === 'expense' && styles.typeBtnExpenseActive]} 
                onPress={() => setNewType('expense')}
              >
                <Ionicons name="arrow-down-circle" size={20} color={newType === 'expense' ? "#FFF" : "#EF4444"} />
                <Text style={[styles.typeBtnText, newType === 'expense' && { color: '#FFF' }]}>Despesa</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={addTransaction}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salvar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15 }}>
              <Text style={{ color: '#71717A', textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  adminBtn: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1E' },
  subtitle: { fontSize: 16, color: '#71717A' },
  chartContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginVertical: 20, alignItems: 'center' },
  listHeader: { marginBottom: 15 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1E' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#311de1', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1E' },
  input: { borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, padding: 10, marginBottom: 15 },
  saveBtn: { backgroundColor: '#311de1', padding: 15, borderRadius: 8, alignItems: 'center' },
  filterWrapper: { flexDirection: 'row', paddingHorizontal: 2, marginTop: 15, marginBottom: 20, gap: 12 },
  filterCard: { flex: 1, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E3E3E3', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  filterCardActiveIncome: { borderColor: '#12A454', borderWidth: 2 },
  filterCardActiveOutcome: { borderColor: '#EF4444', borderWidth: 2 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#363F5F' },
  // Novos estilos para o Modal
  modalTypeContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5E5', gap: 8 },
  typeBtnIncomeActive: { backgroundColor: '#12A454', borderColor: '#12A454' },
  typeBtnExpenseActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  typeBtnText: { fontWeight: 'bold', color: '#71717A' }
});