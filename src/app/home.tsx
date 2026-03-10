import {View,
  Text,
  StyleSheet,
  ScrollView,
  Flatlist
} from "react-native";

//teste de dados
const transactions = [
  { id: "1", label: "Supermercado", value: "R$ 150,00", date: "07/03/2026" },
  { id: "2", label: "Salário", value: "R$ 3.000,00", date: "05/03/2026" },
  { id: "3", label: "Aluguel", value: "R$ 1.200,00", date: "01/03/2026" },

  default function Home() {
    return (
      <View style={styles.container}>
        {/* HEADER / SALDO */ }
        <View style={styles.header}>
          <Text styles={styles.greeting}>Olá, João</Text>
          <Text styles={styles.balanceValue}>Saldo: R$ 1.850,00</Text>
        </View>
      </View>
    )

    {/* LISTA DE TRANSAÇÕES */ }
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Ultimas movimentações</Text>
      
    <FlatList
          data={TRANSACTIONS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionLabel}>{item.label}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.transactionValue, 
                { color: item.type === 'income' ? '#10B981' : '#EF4444' }
              ]}>
                {item.type === 'expense' ? `- ${item.value}` : item.value}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}