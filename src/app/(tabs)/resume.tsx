import { useTransactions } from "@/Hook/useTransactions";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Resumo() {
  const { user } = useAuth();
  const { transactions, balance } = useTransactions(user?.id);

  // 🧠 Agregação de dados
  const totalIncomes = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.value, 0);

  // Dados para o Gráfico
  const chartData = [
    {
      name: "Entradas",
      population: totalIncomes,
      color: "#10B981",
      legendFontColor: "#71717A",
      legendFontSize: 14,
    },
    {
      name: "Saídas",
      population: totalExpenses,
      color: "#EF4444",
      legendFontColor: "#71717A",
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Resumo Financeiro</Text>

        {/* ÁREA DO GRÁFICO */}
        <View style={styles.chartContainer}>
          {totalIncomes === 0 && totalExpenses === 0 ? (
            <Text style={styles.emptyChartText}>
              Sem dados para gerar o gráfico
            </Text>
          ) : (
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute // Mostra os valores absolutos no gráfico
            />
          )}
        </View>

        {/* CARDS DE DETALHAMENTO */}
        <View style={[styles.card, styles.cardIncome]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="arrow-upward" size={20} color="#10B981" />
            <Text style={styles.cardLabel}>Entradas</Text>
          </View>
          <Text style={styles.cardValue}>{formatCurrency(totalIncomes)}</Text>
        </View>

        <View style={[styles.card, styles.cardExpense]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="arrow-downward" size={20} color="#EF4444" />
            <Text style={styles.cardLabel}>Saídas</Text>
          </View>
          <Text style={styles.cardValue}>{formatCurrency(totalExpenses)}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="account-balance-wallet"
              size={20}
              color="#032ad7"
            />
            <Text style={styles.cardLabel}>Saldo Líquido</Text>
          </View>
          <Text
            style={[
              styles.cardValue,
              { color: balance >= 0 ? "#18181B" : "#EF4444" },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: {
    paddingInline: 20,
    paddingBlock: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBlockEnd: 25,
    color: "#18181B",
  },
  chartContainer: {
    alignItems: "center",
    marginBlockEnd: 30,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingBlock: 10,
  },
  emptyChartText: {
    paddingBlock: 50,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    padding: 16,
    marginBlockEnd: 12,
    borderInlineWidth: 4,
    borderInlineColor: "#D4D4D8",
  },
  cardIncome: { borderInlineColor: "#10B981" },
  cardExpense: { borderInlineColor: "#EF4444" },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBlockEnd: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: "#71717A",
    marginInlineStart: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#18181B",
  },
});
