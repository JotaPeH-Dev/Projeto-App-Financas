import { InputPassword } from '@/Components/InputPassword';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from "@hookform/resolvers/zod"; // Usando Zod como no seu schema
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema } from "../../Utils/schema"; // Importando seu schema do Zod

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  // 1. CORREÇÃO: useForm configurado corretamente com Zod
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema) // Use o zodResolver aqui diretamente
  });

  const handleRegister = async (data: any) => {
    try {
      setLoading(true);
      // data contém: name, email, password, confirmPassword
      await signUp(data.name, data.email, data.password);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace('/'); 
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro", error.message || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="person-add" size={60} color="#032ad7" />
          </View>
          <Text style={styles.title}>Cadastrar</Text>
          <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>
        </View>

        <View style={styles.form}>
          {/* NOME */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Nome Completo"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}
              </View>
            )}
          />

          {/* E-MAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="E-mail"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}
              </View>
            )}
          />

          {/* SENHA */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <InputPassword
                  placeholder="Senha (mín. 6 caracteres)"
                  value={value}
                  onChangeText={onChange}
                  // Se o seu componente InputPassword aceitar a prop 'error', passe-a aqui
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}
              </View>
            )}
          />

          {/* CONFIRMAR SENHA */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View>
                <InputPassword
                  placeholder="Confirmar Senha"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message as string}</Text>}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(handleRegister)}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 30
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    marginTop: 5
  },
  form: {
    gap: 15, // Espaçamento entre os blocos de input
    marginBottom: 25
  },
  input: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 15,
    fontSize: 16
  },
  inputError: {
    borderColor: '#EF4444'
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5
  },
  button: {
    backgroundColor: '#032ad7',
    borderRadius: 12,
    padding: 16,
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
    marginTop: 20
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