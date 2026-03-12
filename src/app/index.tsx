import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link } from "expo-router";
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
import { useAuth } from "@/contexts/AuthContext";

// 1. Schema de validação
const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
});

export default function Index() {
  const { signIn } = useAuth(); // Pega a função de login do contexto
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  // 2. Função de Login unificada
  async function handleLogin() {
  console.log("Botão clicado!"); // LOG 1
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    console.log("Erro de validação Zod:", result.error.flatten().fieldErrors); // LOG 2
    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors(fieldErrors);
  } else {
    console.log("Validação OK! Chamando signIn..."); // LOG 3
    setErrors({});
    try {
      await signIn(result.data.email, result.data.password);
      console.log("Função signIn finalizada!"); // LOG 4
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o login.");
    }
  }
}
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require("@/app/assets/9518505.jpg")}
            style={styles.illustration}
          />

          <View style={styles.header}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>
          </View>

          <View style={styles.form}>
            <Input
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="E-mail"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev: any) => ({ ...prev, email: null }));
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

            <Input
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev: any) => ({ ...prev, password: null }));
              }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}

            <Button label="Entrar" onPress={handleLogin} />
          </View>

          <Text style={styles.footerText}>
            Não tem uma conta? {" "}
            <Link href="/signup" style={styles.footerLink}>
              Cadastre-se aqui.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    padding: 32,
    justifyContent: 'center',
  },
  illustration: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  header: { marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: "#1A1A1E" },
  subtitle: { fontSize: 16, color: "#71717A", marginTop: 4 },
  form: { marginTop: 32, gap: 16 },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 4,
  },
  footerText: { textAlign: "center", marginTop: 32, color: "#585860" },
  footerLink: { color: "#032ad7", fontWeight: "700" },
});