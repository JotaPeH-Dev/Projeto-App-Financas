import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../Utils/schema";

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const handleRegister = async (data: any) => {
    try {
      setLoading(true);
      // 'data' contém name, email e password validados pelo Zod
      await signUp(data.name, data.email, data.password);
      
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home') } 
      ]);
    } catch (error: any) {
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
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}
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
  container: { flexGrow: 1, backgroundColor: '#FFF', padding: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0F3FF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', alignSelf: 'flex-start', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#71717A', alignSelf: 'flex-start', marginTop: 5 },
  form: { gap: 5, marginBottom: 25 },
  input: { backgroundColor: '#FBFBFB', borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 12, padding: 18, fontSize: 16 },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginBottom: 10, marginLeft: 5 },
  button: { backgroundColor: '#032ad7', borderRadius: 12, padding: 18, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 40 },
  footerText: { fontSize: 14, color: '#71717A' },
  linkText: { fontSize: 14, color: '#032ad7', fontWeight: 'bold' },
});