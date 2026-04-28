import { View, Text, StyleSheet } from "react-native";

interface BalanceCardProps {
  saldo: number;
  receitas: number;
  despesas: number;
}

export default function BalanceCard({ saldo, receitas, despesas }: BalanceCardProps) { //Função simples para formatar a moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.Label}>Saldo Atual</Text>
      <Text style={styles.balance}>{formatCurrency(saldo)}</Text>

      <View style={styles.row}>
        <View>
          <Text style={[styles.Label, styles.incomeLabel]}>Receitas</Text>
          <Text style={styles.incomeValue}>{formatCurrency(receitas)}</Text>
        </View>

        <View>
          <Text style={[styles.Label, styles.expenseLabel]}>Despesas</Text>
          <Text style={styles.expenseValue}>{formatCurrency(despesas)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1E", // Dark mode style para o card de destaque
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    // Sombra para IOS e Android
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  Label: {
    color: "#A1A1AA",
    fontSize: 14,
    marginBottom: 4,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#3F3F46",
    paddingTop: 16,
  },
  incomeLabel: {color: "#4ADE80"},
  incomeValue: {color: "#FFFFFF", fontSize: 16, fontWeight: "600"},
  expenseLabel: {color: "#F87171"},
  expenseValue: {color: "#FFFFFF", fontSize: 16, fontWeight: "600"},
});