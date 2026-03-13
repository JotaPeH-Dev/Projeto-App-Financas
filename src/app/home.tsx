import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

import BalanceCard from "@/Components/BalanceCard";
import TransactionsItem from "@/Components/TransactionsItem";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "src/contexts/AuthContext";

const DATA_KEY = "@myfinances:transactions";

type Transaction = {
  id: string;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
};

export default function Home() {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("income");
  const [newDate, setNewDate] = useState("");

  // 1. CARREGAR DADOS
  useEffect(() => {
    async function loadTransactions() {
      const response = await AsyncStorage.getItem(DATA_KEY);
      const storageData = response ? JSON.parse(response) : [];
      setTransactions(storageData);
    }
    loadTransactions();
  }, []);

  // 2. FORMATAÇÃO DE MOEDA (R$)
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // 3. MÁSCARA DE DATA
  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
    }
    setNewDate(formatted);
  };

  // 4. FUNÇÃO ADICIONAR
  const addTransaction = async () => {
    if (!newLabel || !newValue || !newDate) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const value = parseFloat(newValue.replace(',', '.'));
    if (isNaN(value)) {
      Alert.alert("Erro", "Valor inválido.");
      return;
    }

    const newTransaction: Transaction = {
      id: String(new Date().getTime()),
      label: newLabel,
      value,
      type: newType,
      date: newDate
    };

    try {
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(updatedTransactions));

      setNewLabel("");
      setNewValue("");
      setNewType("income");
      setNewDate("");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  // 5. FUNÇÃO DELETAR ÚNICO ITEM
  const handleDeleteTransaction = async (id: string) => {
    Alert.alert("Excluir", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const updated = transactions.filter(item => item.id !== id);
          setTransactions(updated);
          await AsyncStorage.setItem(DATA_KEY, JSON.stringify(updated));
        }
      }
    ]);
  };

  // 6. FUNÇÃO LIMPAR TUDO
  const handleClearAll = async () => {
    Alert.alert("Limpar tudo", "Remover todas as transações?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(DATA_KEY);
          setTransactions([]);
        }
      }
    ]);
  };

  // CÁLCULOS
  const totalIncome = transactions
    .filter(item => item.type === "income")
    .reduce((acc, item) => acc + item.value, 0);

  const totalExpense = transactions
    .filter(item => item.type === "expense")
    .reduce((acc, item) => acc + item.value, 0);

  const balance = totalIncome - totalExpense;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
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
          <div style={styles.sectionTitleRow}>
            <Text style={styles.title}>Últimas Transações</Text>
            {transactions.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.ClearButtonText}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
          </div>

          {transactions.length > 0 ? (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionWrapper}>
                <View style={{ flex: 1 }}>
                  <TransactionsItem
                    label={item.label}
                    value={item.value} // Passa o valor como número
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

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
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
              value={newLabel}
              onChangeText={setNewLabel}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={newValue}
              onChangeText={setNewValue}
              keyboardType="numeric"
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, newType === "income" && styles.typeButtonSelected]}
                onPress={() => setNewType("income")}
              >
                <Text style={styles.typeButtonText}>Receita</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, newType === "expense" && styles.typeButtonSelected]}
                onPress={() => setNewType("expense")}
              >
                <Text style={styles.typeButtonText}>Despesa</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/YYYY)"
              value={newDate}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#10B981', marginTop: 20 }]}
              onPress={addTransaction}
            >
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#e2e2e2', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
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
    backgroundColor: "#F4F4F5" 
  } as ViewStyle,
  header: {
     flexDirection: "row",
     justifyContent: "space-between",
      alignItems: "center",
       paddingHorizontal: 24,
        paddingTop: 60,
         marginBottom: 20 },
  greeting: {
     fontSize: 16,
     color: "#71717A" 
    },
  userName: {
     fontSize: 22,
     fontWeight: "bold",
      color: "#1A1A1E" 
    },
  logoutButton: {
     paddingVertical: 6,
     paddingHorizontal: 12,
      backgroundColor: "#3703c7", borderRadius: 8 
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
      color: "#1d1d20" 
    },
  emptyText: {
     textAlign: "center",
     color: "#A1A1AA",
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
      right: 30,
       width: 60,
        height: 60,
         borderRadius: 30,
          backgroundColor: "#311de1",
           justifyContent: "center",
            alignItems: "center",
             elevation: 5 
            },
  fabText: {
     fontSize: 32,
     color: "#FFFFFF",
      fontWeight: "bold" 
    },
  deleteIconButton: {
    padding: 10,
    marginLeft: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: { flex: 1,
     backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end" 
    },
  modalContent: { backgroundColor: "#FFFFFF",
     borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
       padding: 24,
        height: "75%" 
      },
  modalTitle: { fontSize: 20,
     fontWeight: "bold",
      color: "#1A1A1E",
       marginBottom: 20 
      },
  input: { borderWidth: 1,
     borderColor: "#D1D5DB",
      borderRadius: 8,
       padding: 12,
        marginBottom: 16,
         fontSize: 16 
        },
  typeContainer: { flexDirection: "row",
     justifyContent: "space-between",
      marginBottom: 16 
    },
  typeButton: {
     flex: 1,
      padding: 12,
       borderRadius: 8,
        borderWidth: 1,
         borderColor: "#D1D5DB",
          alignItems: "center",
           marginHorizontal: 4 
          },
  typeButtonSelected: {
     backgroundColor: "#651616",
      borderColor: "#0e21cc" 
    },
  typeButtonText: {
     color: "#0d0d9b",
      fontWeight: "600" 
    },
  button: {
     height: 50,
     borderRadius: 8,
      justifyContent: "center",
       alignItems: "center" 
      },
  buttonText: {
     color: "#292323",
      fontWeight: "600",
       fontSize: 16 
      },
  ClearButtonText: { 
    color: "#EF4444",
     fontWeight: "600",
      fontSize: 14 
    },
});