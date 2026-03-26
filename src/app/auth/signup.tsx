<<<<<<< Updated upstream
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Verifique se este caminho está correto

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();

  // 1. ESTADOS (Devem ficar aqui dentro)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. FUNÇÃO DE REGISTRO
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await signUp(name, email, password);
      
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home') } 
      ]);
    } catch (error: any) {
      Alert.alert("Erro ao cadastrar", error.message);
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
            <MaterialIcons name="person-add" size={80} color="#032ad7" />
          </View>
          <Text style={styles.title}>Cadastrar</Text>
          <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister} // Chama a função aqui
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Carregando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Fazer Login.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
=======
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { z } from "zod";
import { signupSchema } from "../../utils/schema"

export default function SignupScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const handleRegister = (data: any) => {
    console.log("Dados prontos para o banco:", data);
    // Aqui você chama sua função de cadastro do database.ts
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Criar Conta</Text>

      {/* CAMPO NOME */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Nome Completo"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}

      {/* CAMPO E-MAIL */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="E-mail"
            keyboardType="email-address" // Corrigindo o teclado numérico da foto
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}

      {/* CAMPO SENHA */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Senha (mín. 6 caracteres)"
            secureTextEntry // Esconde os caracteres
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleRegister)}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
>>>>>>> Stashed changes
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: { flexGrow: 1, backgroundColor: '#FFF', padding: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0F3FF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', alignSelf: 'flex-start', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#71717A', alignSelf: 'flex-start', marginTop: 5 },
  form: { gap: 15, marginBottom: 25 },
  input: { backgroundColor: '#FBFBFB', borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 12, padding: 18, fontSize: 16 },
  button: { backgroundColor: '#032ad7', borderRadius: 12, padding: 18, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: '#71717A' },
  linkText: { fontSize: 14, color: '#032ad7', fontWeight: 'bold' },
=======
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginBottom: 10, fontSize: 12 },
  button: {
    backgroundColor: '#032ad7',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
>>>>>>> Stashed changes
});