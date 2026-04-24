import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from "react"; // Removido o useEffect e useState duplicados
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from '../../contexts/AuthContext'; 
import { useTransactions } from '@/Hook/useTransactions';

export default function Home() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  
  // 1. Usamos os dados reais do hook. 
  // O hook já gerencia o loading e a busca no SQLite.
  const { balance, transactions, loading, refresh } = useTransactions(user?.id);

  const handleLogout = async () => {
    await signOut();
  };

  // 2. Enquanto o SQLite busca os dados, mostramos o loader
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

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* 3. EXIBIÇÃO DO SALDO REAL */}
        <Text style={styles.balance}>
          R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
           <Text style={styles.title}>Últimas Movimentações</Text>
           {/* Botão para ir cadastrar nova transação */}
           <TouchableOpacity onPress={() => router.push("/addTransaction")}>
              <MaterialIcons name="add-circle" size={28} color="#032ad7" />
           </TouchableOpacity>
        </View>

        <FlatList
          data={transactions} // 4. LISTA REAL DO BANCO
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
              </View>
              {/* Diferencia cor de entrada e saída */}
              <Text style={[
                styles.itemValue, 
                { color: item.type === 'income' ? '#2ecc71' : '#e74c3c' }
              ]}>
                {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
              </Text>
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
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { 
    backgroundColor: "#032ad7", 
    padding: 25, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    paddingTop: 50 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  greeting: { color: "#FFF", fontSize: 16 },
  balance: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginTop: 10 },
  content: { flex: 1, padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  item: { 
    padding: 15, 
    backgroundColor: "#F5F5F5", 
    borderRadius: 10, 
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemDate: { fontSize: 12, color: '#999', marginTop: 2 },
  itemValue: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: "center", color: "#71717A", marginTop: 20 }
});