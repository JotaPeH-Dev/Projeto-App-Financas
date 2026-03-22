import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { z } from "zod";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const signupSchema = z.object({
    name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  async function handleSignup() {
    console.log("1. Iniciando processo...");
    const validation = signupSchema.safeParse({ name, email, password, confirmPassword });

    if (!validation.success) {
      console.log("2. Erro de validação:", validation.error.flatten().fieldErrors);
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const userData = { 
        name: validation.data.name, 
        email: validation.data.email, 
        password: validation.data.password 
      };

      await AsyncStorage.setItem('@UserStorage', JSON.stringify(userData));
      console.log("4. Salvo no AsyncStorage!");

      if (Platform.OS === 'web') {
        alert("Conta criada com sucesso!");
        router.replace("/auth");
      } else {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          { text: "OK", onPress: () => router.replace("/auth") }
        ]);
      }
    } catch (error) {
      console.log("ERRO:", error);
      alert("Falha ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  }

  // O RETURN PRECISA ESTAR AQUI DENTRO!
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require("../assets/3962434.jpg")} // Caminho relativo ajustado
            style={styles.illustration}
          />

          <Text style={styles.title}>Cadastrar</Text>
          <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>

          <View style={styles.form}>
            <Input 
              placeholder="Nome"
              onChangeText={setName} 
              value={name} 
            />
            {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}

            <Input 
              placeholder="E-mail" 
              keyboardType="email-address"
              onChangeText={setEmail} 
              value={email} 
            />
            {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

            <Input 
              placeholder="Senha" 
              secureTextEntry
              onChangeText={setPassword} 
              value={password} 
            />
            {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}

            <Input 
              placeholder="Confirmar Senha" 
              secureTextEntry
              onChangeText={setConfirmPassword} 
              value={confirmPassword} 
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword[0]}</Text>}

            <Button 
              label={isLoading ? "Carregando..." : "Cadastrar"} 
              onPress={handleSignup} 
              disabled={isLoading} 
            />
          </View>

          <Text style={styles.footerText}>
            Já tem uma conta? {" "}
            <Link href="/auth" style={styles.footerLink}>
              Fazer Login.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fDfDfD",
    padding: 32,
  },
  illustration: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginTop: 24,
    gap: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 4,
  },
  footerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#585860",
  },
  footerLink: {
    color: "#032ad7",
    fontWeight: "700",
  },
});