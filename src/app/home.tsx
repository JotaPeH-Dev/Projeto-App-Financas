import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "src/contexts/AuthContext";
import BalanceCard from "@/Components/BalanceCard";
import TransactionItem from "@/Components/TransactionsItem";

const MOCK_TRANSACTIONS = [
  {id: 1, label: "Salário", value: 5000, type: "income", date: "01/09/2024"},
  {id: 2, label: "Aluguel", value: 1500, type: "expense", date: "05/09/2024"},
  {id: 3, label: "Mercado", value: 2000, type: "expense", date: "10/09/2024"}
] as const; 

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    // ScrollView é bom para garantir que telas com muitos dados não cortem em celulares menores
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* SEÇÃO 1: HEADER (Saudação + Botão Sair) */}
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
        <Text style={styles.title}>Últimas Transações</Text>
        {MOCK_TRANSACTIONS.map((item) => (
        <TransactionItem
          key={item.id}
          label={item.label}
          value={item.value}
          type={item.type}
          date={item.date}
        />
      ))}  
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
        
        {/* Aqui entraremos com a FlatList ou Map no próximo passo */}
        <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60, // Ajuste para não bater no entalhe (notch) do celular
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
    color: "#1A1A1E",
  },
  emptyText: {
    textAlign: "center",
    color: "#A1A1AA",
    marginTop: 20,
    fontStyle: "italic",
  }
});