import { useTransactions } from "@/Hook/useTransactions";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { AddTransactionModal } from "../../Components/AddTransactionModal";
import { useAuth } from "../../contexts/AuthContext";
import { TransactionService, Transaction } from "@/database/TransactionService";

export default function Home() {
  const { signOut, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { balance, transactions, loading, refresh } = useTransactions(user?.id);

  const handleLogout = async () => {
    await signOut();
  };

  // --- LÓGICA DE EXCLUSÃO ---
  const handleDelete = (id: number) => {
    Alert.alert("Excluir", "Deseja realmente apagar esta movimentação?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          await TransactionService.deleteTransaction(id);
          refresh(); // Atualiza lista e saldo
        } 
      }
    ]);
  };

  // --- LÓGICA DE EDIÇÃO ---
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  // Garante que ao fechar o modal, o estado de edição seja limpo
  const handleCloseModal = () => {
    setEditingTransaction(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#032ad7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Olá, {user?.name || "Bem-vindo"}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.balance}>
          R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Últimas Movimentações</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialIcons name="add-circle" size={32} color="#032ad7" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemDate}>
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <View style={styles.itemActions}>
                <Text style={[styles.itemValue, { color: item.type === "income" ? "#2ecc71" : "#e74c3c" }]}>
                  {item.type === "income" ? "+" : "-"} R$ {item.value.toFixed(2)}
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <MaterialIcons name="edit" size={20} color="#032ad7" style={styles.icon} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#EF4444" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
        />
      </View>

      <AddTransactionModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSuccess={refresh}
        transaction={editingTransaction} // Passa a transação para o Modal saber que é edição
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#032ad7",
    paddingInline: 25,
    paddingBlockEnd: 25,
    borderEndStartRadius: 20,
    borderEndEndRadius: 20,
    paddingBlockStart: 50,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoutButton: { padding: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8 },
  greeting: { color: "#FFF", fontSize: 16 },
  balance: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginBlockStart: 10 },
  content: { flex: 1, paddingInline: 20, paddingBlockStart: 20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBlockEnd: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  item: {
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBlockEnd: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  itemDate: { fontSize: 12, color: "#999", marginBlockStart: 2 },
  itemValue: { fontSize: 16, fontWeight: "bold" },
  itemActions: { alignItems: "flex-end" },
  actionButtons: { 
    flexDirection: "row", 
    marginBlockStart: 8 // 🧠 Substitui marginTop
  },
  icon: { 
    marginInlineStart: 15 // 🧠 Substitui marginLeft
  },
  emptyText: { textAlign: "center", color: "#71717A", marginBlockStart: 20 },
});