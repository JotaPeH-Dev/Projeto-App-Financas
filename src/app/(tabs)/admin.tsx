import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  Alert, ActivityIndicator, SafeAreaView 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
// Importe as funções do seu banco de dados
import { getAllUsers, deleteUser } from '../../database/database'; 

export default function AdminScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega a lista do SQLite
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza sempre que entrar na aba
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  // Função para deletar com confirmação
  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o usuário ${name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteUser(id);
              loadUsers(); // Recarrega a lista após deletar
            } catch (error) {
              Alert.alert("Erro", "Falha ao deletar usuário.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        <Text style={styles.subtitle}>Gerenciamento de banco de dados local.</Text>
      </View>

      {/* Card de Resumo com o Contador */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryTitle}>Total de Usuários</Text>
          <Text style={{ color: '#FFF', opacity: 0.8, fontSize: 12 }}>Cadastrados no banco</Text>
        </View>
        <Text style={styles.summaryNumber}>{users.length}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#032ad7" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                {item.is_admin && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminText}>ADMIN</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <FontAwesome5 name="trash-alt" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20 
  },
  header: {
    marginTop: 40,
    marginBottom: 20 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181B' 
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A' 
  },
  summaryCard: {
    backgroundColor: '#032ad7',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  summaryTitle: { 
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' },
  summaryNumber: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold' },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181B' 
  },
  userEmail: {
    fontSize: 14,
    color: '#71717A' 
  },
  adminBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  adminText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4338CA' 
  },
  deleteButton: {
    padding: 10 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#A1A1AA' 
  },
});