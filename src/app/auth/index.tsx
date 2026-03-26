import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  // 1. ESTADOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. FUNÇÃO DE LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      
      // Se o login der certo, o AuthContext atualiza o 'user' 
      // e você pode redirecionar para a Home
      router.replace('/(tabs)/home'); 
    } catch (error: any) {
      Alert.alert("Falha no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="lock" size={70} color="#032ad7" />
          </View>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Botão Entrar Conectado */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.linkText}>Cadastre-se.</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// Estilos mantidos similares ao design original
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  // Estilo para o círculo ao redor do ícone
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F0F3FF', // Azul bem clarinho de fundo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', alignSelf: 'flex-start', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#71717A', alignSelf: 'flex-start', marginTop: 5 },
  form: { gap: 15, marginBottom: 25 },
  input: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#1A1A1E',
  },
  button: {
    backgroundColor: '#032ad7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 14, color: '#71717A' },
  linkText: { fontSize: 14, color: '#032ad7', fontWeight: 'bold' },
});