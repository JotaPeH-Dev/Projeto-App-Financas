import {
  StyleSheet,
  Text,
  View, 
  FlatList,
} from "react-native";

//teste de dados
const transactions = [
  { id: "1", label: "Supermercado", value: "R$ 150,00", type: "expense", date: "07/03/2026" },
  { id: "2", label: "Salário", value: "R$ 3.000,00", type: "income", date: "05/03/2026" },
  { id: "3", label: "Aluguel", value: "R$ 1.200,00", type: "expense", date: "01/03/2026" },
];

export default function Home() {
  // 1. Lógica do Saldo Corrigida
  const totalBalance = transactions.reduce((acc, transaction) => {
    // Convertendo a string "R$ 150,00" em número real
    const value = parseFloat(
      transaction.value.replace("R$ ", "").replace(".", "").replace(",", ".")
    );

    // USAMOS 'transaction' (o nome que você deu no parâmetro)
    if (transaction.type === "income") {
      return acc + value;
    } else {
      return acc - value;
    }
  }, 0);

  // 2. Formatação do Saldo (Removi o "R$" extra pois o toLocaleString já coloca)
  const formattedBalance = totalBalance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <View style={styles.container}>
      {/* HEADER / SALDO */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, João</Text>
        <Text style={styles.balanceValue}>{formattedBalance}</Text>
      </View>

      {/* 3. LISTA DE TRANSAÇÕES (Agora dentro do return principal) */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Últimas movimentações</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionLabel}>{item.label}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionValue,
                  { color: item.type === "income" ? "#10B981" : "#EF4444" },
                ]}
              >
                {item.type === "expense" ? `- ${item.value}` : item.value}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

  {/* LISTA DE TRANSAÇÕES */ }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  header: {
    backgroundColor: '#032ad7',
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  balanceCard: {
    marginTop: 24,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1E',
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1E',
  },
  transactionDate: {
    fontSize: 12,
    color: '#71717A',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});