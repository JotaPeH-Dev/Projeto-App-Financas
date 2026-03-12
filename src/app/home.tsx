import BalanceCard from "@/Components/BalanceCard";
import TransactionsItem from "@/Components/TransactionsItem";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { useAuth } from "src/contexts/AuthContext";

const MOCK_TRANSACTIONS = [
  { id: 1, label: "Salário", value: 5000, type: "income" as const, date: "01/09/2024" },
  { id: 2, label: "Aluguel", value: 1500, type: "expense" as const, date: "05/09/2024" },
  { id: 3, label: "Mercado", value: 2000, type: "expense" as const, date: "10/09/2024" }
];

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
        {/* SEÇÃO 1: HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÃO 2: CARD DE SALDO */}
        <View style={styles.content}>
          <BalanceCard
            saldo={5000}
            receitas={8000}
            despesas={3000}
          />
        </View>

        {/* SEÇÃO 3: TRANSAÇÕES */}
        <View style={styles.content}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.title}>Últimas Transações</Text>
          </View>

          {transactions.length > 0 ? (
            transactions.map((item) => (
              <TransactionsItem
                key={item.id}
                label={item.label}
                value={item.value}
                type={item.type}
                date={item.date}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          )}
        </View>
      </ScrollView>

      {/* Botão Flutuante "+" */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de Cadastro */}
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
              onChangeText={setNewDate}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#10B981', marginTop: 20 }]}
              onPress={addTransaction}
            >
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#EF4444', marginTop: 10 }]}
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
    backgroundColor: "#F4F4F5",
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#71717A",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1E",
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFE4E6",
    borderRadius: 8,
  },
  logoutText: {
    color: "#E11D48",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitleRow: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d1d20",
  },
  emptyText: {
    textAlign: "center",
    color: "#A1A1AA",
    marginTop: 20,
    fontStyle: "italic",
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
    elevation: 5, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
    transform: [{ translateY: -4 }], // Ajuste visual para centralizar o "+" no botão
  },
  // Estilos que faltavam para o Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "70%", // Ajuste o tamanho conforme necessário
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1E",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    marginHorizontal: 4,
  },
  typeButtonSelected: {
    backgroundColor: "#E11D48",
    borderColor: "#E11D48",
  },
  typeButtonText: {
    color: "#1A1A1E",
    fontWeight: "600",
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});