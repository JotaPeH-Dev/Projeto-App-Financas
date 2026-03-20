import { Redirect } from "expo-router";
import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link, useRouter } from "expo-router"; // Adicionei o useRouter
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
import { useAuth } from "src/contexts/AuthContext"; // Certifique-se que este caminho está correto

// 1. Schema de validação
const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
});

export default function Index() {
  const router = useRouter(); 
  const { signIn } = useAuth(); // ESTA É A ÚNICA DECLARAÇÃO DE useAuth QUE DEVE EXISTIR AQUI
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  async function handleLogin() {
    const result = loginSchema.safeParse({ email, password });

    // Se a validação do Zod falhar, apenas mostramos os erros na tela
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return; // Pare aqui, não redirecione!
    }

    setErrors({});
    
    try {
      console.log("Tentando logar com:", result.data.email);
      await signIn(result.data.email, result.data.password);
      
      // Se o login funcionar, o AuthContext vai atualizar o estado 'user'
      // O seu _layout.tsx vai perceber isso e te levar para a Home sozinho.
    } catch (error: any) {
      Alert.alert("Erro de Login", error.message || "Credenciais incorretas.");
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
            source={require("src/app/assets/9518505.jpg")}
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
  {/* Certifique-se que o caminho bate com app/auth/signup.tsx */}
  <Link href="/auth/signup" style={styles.footerLink}>
    Cadastre-se aqui.
  </Link>
</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ... (seus estilos continuam iguais)

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