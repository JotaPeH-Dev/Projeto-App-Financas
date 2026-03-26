import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho conforme sua estrutura

export default function AdminScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair do Painel",
      "Tem certeza que deseja encerrar a sessão administrativa?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut();
              // Redireciona para a tela inicial/login e limpa o histórico
              router.replace('/auth'); 
            } catch (error) {
              Alert.alert("Erro", "Falha ao encerrar sessão.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.adminTag}>PAINEL ADMIN</Text>
          <Text style={styles.userName}>{user?.name || 'Administrador'}</Text>
        </View>

        {/* BOTÃO DE SAIR */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="exit-to-app" size={26} color="#EF4444" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.info}>Bem-vindo à área de gerenciamento.</Text>
        {/* Restante do seu conteúdo admin aqui */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  adminTag: { fontSize: 12, fontWeight: 'bold', color: '#64748B', letterSpacing: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  info: { color: '#94A3B8', fontSize: 16 }
});