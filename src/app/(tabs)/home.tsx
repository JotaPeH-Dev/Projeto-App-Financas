import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário

export default function Home() {
  const router = useRouter();
  const { signOut, user } = useAuth(); // Pegamos o signOut do seu contexto
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Função de Logout
  const handleLogout = async () => {
  await signOut(); // O setUser(null) aqui vai fazer o Layout lá de cima te expulsar na hora!
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
          <Text style={styles.greeting}>Olá, {user?.name || 'Bem-vindo'}!</Text>

          {/* BOTÃO DE SAIR */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.balance}>R$ 0,00</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Últimas Movimentações</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}><Text>{item.description}</Text></View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8
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