import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserById, updateUser, User } from '../../../database/database'; // Ajuste o caminho

export default function EditUserScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ESTADOS DOS CAMPOS DO FORMULÁRIO
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // ========================================================
  // 1. NOVO ESTADO PARA VISIBILIDADE DA SENHA
  const [passwordVisible, setPasswordVisible] = useState(false);
  // ========================================================

  const [loading, setLoading] = useState(true);

  // Carrega os dados atuais ao abrir a tela
  useEffect(() => {
    async function loadUser() {
      // DEBUG: Verifique se o ID está chegando da URL
      console.log(`Abrindo edição para o ID da URL: "${id}"`);

      // Converta o ID para número com segurança
      const userId = Number(id);

      if (isNaN(userId)) {
        Alert.alert("Erro", "ID de usuário inválido.");
        router.back();
        return;
      }

      try {
        setLoading(true);
        // Busca o usuário no banco
        const data: User | null = await getUserById(userId);

        if (data) {
          // Preenche o formulário
          setName(data.name);
          setEmail(data.email);
          setPassword(data.password); // Mantenha a senha se não for alterada
          setIsAdmin(data.is_admin);
        } else {
          Alert.alert("Erro", "Usuário não encontrado no banco.");
          router.back();
        }
      } catch (e) {
        console.error("Erro crítico ao buscar usuário no banco:", e);
        Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
        router.back();
      } finally {
        // Encerra o loading
        setLoading(false);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleSave = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      await updateUser(Number(id), {
        name,
        email,
        password,
        is_admin: isAdmin
      });

      Alert.alert("Sucesso", "Usuário atualizado!");
      router.back();
    } catch (e) {
      console.error("Erro ao salvar alterações:", e);
      Alert.alert("Erro", "Falha ao salvar. O e-mail pode já estar em uso.");
    } finally {
      setLoading(false);
    }
  };

  // TELA DE CARREGAMENTO
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#032ad7" />
        <Text style={{ marginTop: 10, color: '#71717A' }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={18} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Usuário</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* FORMULÁRIO */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: João Pedro" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-MAIL</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        {/* ======================================================== */}
        {/* 2. CAMPO DA SENHA COM O ÍCONE DE OLHO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>SENHA (PARA ACESSO)</Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput} // Estilo específico para o input
              value={password}
              onChangeText={setPassword}
              // 3. ALTERNAsecureTextEntry BASEADO NO ESTADOpasswordVisible
              secureTextEntry={!passwordVisible} // ! inverte o booleano (se visible for false, secure é true)
              placeholder="Senha atual ou nova"
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)} // Inverte o estado ao clicar
            >
              <FontAwesome5
                // Alterna o ícone baseado no estado
                name={passwordVisible ? "eye-slash" : "eye"}
                size={18}
                color="#A1A1AA"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* ======================================================== */}

        {/* SWITCH DE ADMIN */}
        <View style={styles.switchContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Acesso de Administrador</Text>
            <Text style={styles.switchSubtitle}>Permite gerenciar usuários e configurações.</Text>
          </View>
          <Switch
            value={isAdmin}
            onValueChange={setIsAdmin}
            trackColor={{ false: "#E2E8F0", true: "#032ad7" }}
            thumbColor={isAdmin ? "#FFF" : "#F4F4F5"}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Confirmar Alterações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, marginTop: 10 },
  backButton: { padding: 10, backgroundColor: '#F4F4F5', borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181B' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#71717A', marginBottom: 8, letterSpacing: 1 },
  // Estilo padrão para inputs normais (nome, e-mail)
  input: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0', color: '#1E293B' },

  // ========================================================
  // NOVOS ESTILOS PARA O CAMPO DE SENHA COM ÍCONE
  passwordInputContainer: {
    flexDirection: 'row', // Alinha o input e o ícone na horizontal
    alignItems: 'center', // Alinha verticalmente no centro
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  passwordInput: {
    flex: 1, // O input ocupa todo o espaço restante
    padding: 16,
    fontSize: 16,
    color: '#1E293B'
  },
  eyeIcon: {
    padding: 16 // Dá uma área clicável maior para o ícone
  },
  // ========================================================

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  switchSubtitle: { fontSize: 12, color: '#71717A', paddingRight: 10 },
  saveButton: { backgroundColor: '#032ad7', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 2 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});