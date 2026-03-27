import { InputPassword } from '@/Components/InputPassword';
import { FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import * as z from "zod";
import { useAuth } from "../../contexts/AuthContext";

// 1. Schema de validação
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Tipagem para o TS não reclamar
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  // 2. Inicialização do Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 3. Função de Login atualizada
  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert("Falha no Login", error.message || "E-mail ou senha incorretos.");
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
            <FontAwesome5 name="lock" size={50} color="#032ad7" />
          </View>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>
        </View>

        <View style={styles.form}>
          {/* CAMPO E-MAIL COM CONTROLLER */}
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
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* CAMPO SENHA */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputPassword
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                error={!!errors.password}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(handleLogin)} // IMPORTANTE: Chamar com handleSubmit
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
            <Text style={styles.linkText}>Cadastre-se.</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start'
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    alignSelf: 'flex-start',
    marginTop: 5
  },
  form: {
    gap: 15,
    marginBottom: 25
  },
  input: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#1A1A1E',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#032ad7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
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