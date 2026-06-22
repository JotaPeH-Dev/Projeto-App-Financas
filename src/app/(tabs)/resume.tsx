import { getBudgetEfficiency } from "@/database/database";
import { useTransactions } from "@/Hook/useTransactions";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useAuth } from "../../contexts/AuthContext";

const screenWidth = Dimensions.get("window").width;

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// --- FUNÇÃO PARA GERAR COR ÚNICA E CONSISTENTE BASEADA NO TEXTO ---
const generateColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Converte para um código hexadecimal de cor estável
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    // Ajusta a luminosidade para evitar cores excessivamente claras ou invisíveis no fundo branco
    const safeValue = Math.floor((value + 50) / 1.3); 
    color += `00${safeValue.toString(16)}`.slice(-2);
  }
  return color;
};

export default function Resumo() {
  const { user } = useAuth();
  const { transactions } = useTransactions(user?.id);
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const data = await getBudgetEfficiency(user.id);
        setEfficiencyData(data);
      }
    };
    loadData();
  }, [transactions]);

  // Mapeia os dados aplicando dinamicamente a cor estável a partir do nome da categoria
  const chartData = efficiencyData.map((item) => {
    const categoryColor = generateColorFromString(item.name);
    return {
      name: item.name,
      population: item.totalSpent,
      color: categoryColor,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    };
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Análise de Gastos</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      <View style={styles.planSection}>
        <Text style={styles.sectionTitle}>Progresso do Plano Mensal</Text>

        {efficiencyData.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum gasto planejado encontrado.
          </Text>
        ) : (
          efficiencyData.map((item, index) => {
            // Pega a mesma cor gerada para a barra de progresso correspondente
            const categoryColor = generateColorFromString(item.name);

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>{item.name}</Text>
                  <Text style={[styles.barValues, { color: categoryColor }]}>
                    {formatBRL(item.totalSpent)} /{" "}
                    <Text style={styles.limitText}>
                      {formatBRL(item.limitValue)}
                    </Text>
                  </Text>
                </View>
                <View style={styles.bgBar}>
                  <View
                    style={[
                      styles.activeBar,
                      {
                        width: `${Math.min(item.percentage, 100)}%`,
                        // Se ultrapassar o limite fica vermelho, senão usa a cor dinâmica da categoria
                        backgroundColor: item.percentage >= 100 ? "#EF4444" : categoryColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>
                  {item.percentage.toFixed(0)}% do limite
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18181B",
    marginBottom: 20,
    paddingTop: 40,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingVertical: 10,
  },
  planSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  barWrapper: {
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  barLabel: { fontSize: 15, fontWeight: "600", color: "#334155" },
  barValues: { fontSize: 13, fontWeight: "bold" },
  limitText: { color: "#94A3B8", fontWeight: "normal" },
  bgBar: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  activeBar: { height: "100%", borderRadius: 5 },
  percentageText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 5,
    textAlign: "right",
  },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 20 },
});