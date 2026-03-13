import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import BalanceCard from "@/Components/BalanceCard";
import TransactionsItem from "@/Components/TransactionsItem";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { useAuth } from "src/contexts/AuthContext";

const DATA_KEY = "@myfinances:transactions";

type Transaction = {
  id: string;
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
};

// ... (mantenha os imports e tipos iguais)

export default function Home() {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("income");
  const [newDate, setNewDate] = useState("");

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
    const newId = transactions.length + 1;
    const newTransactions = { id: newId, label: newLabel, value, type: newType as "income" | "expense", date: newDate };
    setTransactions([...transactions, newTransactions]);
    setNewLabel("");
    setNewValue("");
    setNewType("income");
    setNewDate("");
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* ... Header ... */}

        <View style={styles.content}>
          {/* AQUI ESTAVA O PROBLEMA: Precisamos passar os valores formatados */}
          <BalanceCard
            saldo={balance}
            receitas={totalIncome}
            despesas={totalExpense}
          />
        </View>

        <View style={styles.content}>
        <View style={styles.content}>
  {/* ANTES ESTAVA <div>, MUDE PARA <View> */}
  <View style={styles.sectionTitleRow}> 
    <Text style={styles.title}>Últimas Transações</Text>
    {transactions.length > 0 && (
      <TouchableOpacity onPress={handleClearAll}>
        <Text style={styles.ClearButtonText}>Limpar Tudo</Text>
      </TouchableOpacity>
    )}
  </View>
  {/* ... restante do código */}
</View>

          {transactions.length > 0 ? (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionWrapper}>
                <View style={{ flex: 1 }}>
                  <TransactionsItem
                    label={item.label}
                    value={item.value} // Passa o valor numérico, formata dentro do componente
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

      {/* ... Restante do Modal e FAB ... */}
    </View>
  );
}

// ... (mantenha os estilos iguais)
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
    marginBottom: 20
  },
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
    paddingVertical: 8,
    paddingHorizontal: 24,
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
  right: 20,
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: "#311de1",
  justifyContent: "center",
  alignItems: "center",
  elevation: 10, // Garante que fique acima de tudo no Android
  zIndex: 99,    // Garante que fique acima de tudo no iOS
},
fabText: {
  fontSize: 34,
  color: "#FFFFFF",
  fontWeight: "300", 
  transform: [{ translateY: -2 }], // Ajuste fino para o centro
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
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
    borderColor: "#D1D5DB",
    alignItems: "center",
    marginHorizontal: 4
  },
  typeButtonSelected: {
    backgroundColor: "#6a6381",
    borderColor: "#8d8d90"
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
    color: "#303030",
    fontWeight: "600",
    fontSize: 16
  },
  ClearButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14
  },
});