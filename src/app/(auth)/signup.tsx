import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // <-- VERIFIQUE ESTE CAMINHO

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signupSchema } from "../../Utils/schema"; // <-- IMPORTANDO O SCHEMA QUE CRIAMOS

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth(); // Sua função de cadastro do AuthContext
  const [loading, setLoading] = useState(false);

  // Configuração do React Hook Form com Zod
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  // Função que é chamada quando o botão é clicado E os dados estão válidos
  const handleRegister = async (data: any) => {
    // 'data' já contém name, email e password validados e formatados pelo Zod
    console.log("Dados validados e prontos:", data);

    try {
      setLoading(true);

      // Chame sua função de cadastro real aqui (Firebase, API, Supabase, etc)
      // Exemplo: await signUp(data.name, data.email, data.password);

      // Simulando uma espera de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home') }
      ]);
    } catch (error: any) {
      // Trate erros vindos do backend aqui (ex: e-mail já existe)
      Alert.alert("Erro ao cadastrar", error.message || "Ocorreu um erro inesperado.");
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
            {/* Ícone idêntico ao da foto */}
            <MaterialIcons name="person-add" size={80} color="#032ad7" />
          </View>
          <Text style={styles.title}>Cadastrar</Text>
          <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>
        </View>

        <View style={styles.form}>
          {/* CAMPO NOME */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]} // Borda vermelha se houver erro
                placeholder="Nome Completo"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {/* Exibe mensagem de erro do Zod */}
          {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}

          {/* CAMPO E-MAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="E-mail"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
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
                value={value}
                onChangeText={onChange}
                secureTextEntry // Esconde os caracteres
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}
        </View>

        {/* BOTÃO CADASTRAR */}
        {/* O handleSubmit verifica a validação antes de chamar handleRegister */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]} // Opacidade menor se estiver carregando
          onPress={handleSubmit(handleRegister)}
          disabled={loading} // Desativa o botão enquanto carrega
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    padding: 20 
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30 
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginTop: 20 
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    alignSelf: 'flex-start',
    marginTop: 5 
  },
  form: {
    gap: 5,
    marginBottom: 25 
  }, // Gap menor para caber os erros
  input: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 18,
    fontSize: 16 
  },
  inputError: {
    borderColor: '#EF4444' 
  }, // Estilo para campo com erro
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5 
  }, // Estilo da mensagem de erro
  button: {
    backgroundColor: '#032ad7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center' 
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold' 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40 
  },
  footerText: {
    fontSize: 14,
    color: '#71717A' 
  },
  linkText: {
    fontSize: 14,
    color: '#032ad7',
    fontWeight: 'bold' 
  },
});