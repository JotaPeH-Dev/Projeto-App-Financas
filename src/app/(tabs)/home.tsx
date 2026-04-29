import { Transaction, TransactionService } from "@/database/TransactionService";
import { useTransactions } from "@/Hook/useTransactions";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AddTransactionModal } from "../../Components/AddTransactionModal";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { signOut, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Hook que busca saldo e transações
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
          refresh(); // Atualiza a lista após deletar
        },
      },
    ]);
  };

  // --- LÓGICA DE EDIÇÃO ---
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  // Limpa o estado de edição ao fechar
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
          {balance.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
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
                {/* Exibe a categoria salva abaixo do nome (opcional, mas ajuda na conferência) */}
                <Text style={styles.itemCategory}>
                  {item.category || "Sem categoria"}
                </Text>
                <Text style={styles.itemDate}>
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <View style={styles.itemActions}>
                <Text
                  style={[
                    styles.itemValue,
                    { color: item.type === "income" ? "#2ecc71" : "#e74c3c" },
                  ]}
                >
                  {item.type === "income" ? "+" : "-"} R${" "}
                  {item.value.toFixed(2)}
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color="#032ad7"
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialIcons
                      name="delete"
                      size={20}
                      color="#EF4444"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSuccess={refresh}
        transaction={editingTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#032ad7",
    paddingHorizontal: 25,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  greeting: { color: "#FFF", fontSize: 16 },
  balance: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginTop: 10 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  item: {
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  itemCategory: {
    fontSize: 11,
    color: "#032ad7",
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 2,
  },
  itemDate: { fontSize: 11, color: "#999", marginTop: 2 },
  itemValue: { fontSize: 16, fontWeight: "bold" },
  itemActions: { alignItems: "flex-end" },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  icon: {
    marginLeft: 15,
  },
  emptyText: { textAlign: "center", color: "#71717A", marginTop: 20 },
});
