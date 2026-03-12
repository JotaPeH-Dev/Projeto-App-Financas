import { View, Text, StyleSheet } from "react-native";
import { string } from "zod";

interface TransactionItemProps {
  label: string;
  value: number;
  type: "income" | "expense";
  date: string;
}

export default function TransactionItem({ label, value, type, date }: TransactionItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={[
        styles.value, 
        {color: type === "income" ? "#10B981" : "#EF4444"} // Verde para receitas, vermelho para despesas
      ]}>
        {type === "income" ? "+" : "-"}{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4e4e7",
  },
  info: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#18181B",
  },
  date: {
    fontSize: 12,
    color: "#71717A",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});