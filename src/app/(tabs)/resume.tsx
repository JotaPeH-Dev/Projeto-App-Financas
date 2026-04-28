import { useTransactions } from "@/Hook/useTransactions";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Resumo() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { user } = useAuth();
  const { transactions } = useTransactions(user?.id);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const changeDate = (amount: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    setDate(newDate);
  };

  // --- LÓGICA DE FILTRAGEM ---
  const transactionsOfMonth = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return (
      tDate.getMonth() === date.getMonth() &&
      tDate.getFullYear() === date.getFullYear()
    );
  });

  const transactionsOfDay = transactionsOfMonth.filter((t) => {
    const tDate = new Date(t.date);
    return tDate.getDate() === date.getDate();
  });

  const hasDataForDay = transactionsOfDay.length > 0;
  const filteredTransactions = hasDataForDay
    ? transactionsOfDay
    : transactionsOfMonth;

  const totalIncomes = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.value, 0);

  const balance = totalIncomes - totalExpenses;

  // --- 📊 GRÁFICO: ENTRADAS VS SAÍDAS ---
  const mainChartData = [
    {
      name: "Entradas",
      population: totalIncomes,
      color: "#10B981", // Verde
      legendFontColor: "#71717A",
      legendFontSize: 12,
    },
    {
      name: "Saídas",
      population: totalExpenses,
      color: "#EF4444", // Vermelho
      legendFontColor: "#71717A",
      legendFontSize: 12,
    },
  ];

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

        <View style={styles.headerRow}>
          <Pressable onPress={() => changeDate(-1)} style={styles.arrowButton}>
            <MaterialIcons name="chevron-left" size={28} color="#032ad7" />
          </Pressable>

          <Pressable
            style={styles.filterButton}
            onPress={() => setShowPicker(true)}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={styles.filterLabel}>Filtro Ativo</Text>
              <Text style={styles.filterText}>
                {date.toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => changeDate(1)} style={styles.arrowButton}>
            <MaterialIcons name="chevron-right" size={28} color="#032ad7" />
          </Pressable>
        </View>

        <Text style={styles.viewModeText}>
          {hasDataForDay
            ? `Exibindo o dia ${date.getDate()}`
            : `Exibindo o mês completo`}
        </Text>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Balanço de Entradas e Saídas</Text>
          {totalIncomes === 0 && totalExpenses === 0 ? (
            <Text style={styles.emptyChartText}>
              Sem movimentações neste período
            </Text>
          ) : (
            <PieChart
              data={mainChartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          )}
        </View>

        {/* CARDS RESUMO */}
        <View style={[styles.card, styles.cardIncome]}>
          <Text style={styles.cardLabel}>Total Entradas</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalIncomes)}</Text>
        </View>

        <View style={[styles.card, styles.cardExpense]}>
          <Text style={styles.cardLabel}>Total Saídas</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalExpenses)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Saldo Líquido</Text>
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
  scrollContent: { paddingHorizontal: 20, paddingVertical: 30 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#18181B",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  arrowButton: {
    padding: 10,
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  filterButton: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F4F4F5",
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  filterLabel: {
    fontSize: 10,
    color: "#71717A",
    textTransform: "uppercase",
    textAlign: "center",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#18181B",
    textAlign: "center",
  },
  viewModeText: {
    fontSize: 12,
    color: "#71717A",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingVertical: 15,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#71717A",
    marginBottom: 10,
  },
  emptyChartText: { paddingVertical: 50, color: "#94A3B8" },
  card: {
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#D4D4D8",
  },
  cardIncome: { borderLeftColor: "#10B981" },
  cardExpense: { borderLeftColor: "#EF4444" },
  cardLabel: { fontSize: 13, color: "#71717A", marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: "bold", color: "#18181B" },
});
