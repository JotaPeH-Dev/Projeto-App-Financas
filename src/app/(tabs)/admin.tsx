import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function Admin() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await AsyncStorage.getItem('@AllUsers');
      if (data) {
        setUsers(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se usuário é admin
  const isAdmin = user && users.find(u => u.email === user.email)?.isAdmin;

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="lock-closed" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Acesso Negado</Text>
          <Text style={styles.errorText}>
            Apenas administradores podem acessar esta área.
          </Text>
          <TouchableOpacity onPress={signOut}>
            <Ionicons name="log-out-outline" size={28} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleDelete = (userId: string) => {
    Alert.alert(
      "Deletar Usuário",
      "Tem certeza que deseja deletar este usuário?",
      [
        { text: "Cancelar", onPress: () => { } },
        {
          text: "Deletar",
          onPress: async () => {
            const updatedUsers = users.filter(u => u.id !== userId);
            await AsyncStorage.setItem('@AllUsers', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            Alert.alert("Sucesso", "Usuário deletado com sucesso!");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const updatedUsers = users.map(u =>
      u.id === selectedUser?.id
        ? { ...u, name: editName, email: editEmail }
        : u
    );

    await AsyncStorage.setItem('@AllUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setModalVisible(false);
    setSelectedUser(null);
    Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Ionicons name="arrow-back" size={24} color="#311de1" />
          </TouchableOpacity>
          <Text style={styles.title}>Painel de Administração</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Gerenciar usuários ({users.length})</Text>

        {users.length === 0 ? (
          <View style={styles.emptyContent}>
            <Ionicons name="people" size={48} color="#71717A" />
            <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.isAdmin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminText}>ADMIN</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userDate}>
                  Criado em: {formatDate(user.createdAt)}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => handleEditOpen(user)}
                  style={[styles.actionBtn, styles.editBtn]}
                >
                  <Ionicons name="pencil" size={18} color="#FFF" />
                </TouchableOpacity>

                {!user.isAdmin && (
                  <TouchableOpacity
                    onPress={() => handleDelete(user.id)}
                    style={[styles.actionBtn, styles.deleteBtn]}
                  >
                    <Ionicons name="trash" size={18} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuário</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome do usuário"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="E-mail do usuário"
              keyboardType="email-address"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1E',
    textAlign: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1E',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#71717A',
    marginTop: 12,
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1E',
  },
  adminBadge: {
    backgroundColor: '#311de1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 4,
  },
  userDate: {
    fontSize: 11,
    color: '#A1A1A9',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#311de1',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1E',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E5E5E5',
  },
  cancelText: {
    color: '#1A1A1E',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#311de1',
  },
  saveText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
