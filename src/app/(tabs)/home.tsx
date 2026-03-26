import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulação de carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        <Text style={styles.greeting}>Olá, Bem-vindo!</Text>
        <Text style={styles.balance}>R$ 0,00</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Últimas Movimentações</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF" 
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center" 
  },
  header: {
    backgroundColor: "#032ad7",
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  greeting: {
    color: "#FFF",
    fontSize: 16 
  },
  balance: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10 
  },
  content: {
    flex: 1,
    padding: 20 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15 
  },
  item: {
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 10 
  },
  emptyText: {
    textAlign: "center",
    color: "#71717A",
    marginTop: 20 
  }
});