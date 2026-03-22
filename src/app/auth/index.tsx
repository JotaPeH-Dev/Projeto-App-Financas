import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useAuth } from "src/contexts/AuthContext";
import { z } from "zod";

// 1. Schema de validação
const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
});

export default function Index() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // 1. Se o usuário já estiver logado, redireciona IMEDIATAMENTE antes de carregar o resto
  if (user) {
    return <Redirect href="/tabs/home" />;
  }

  async function handleLogin() {
    try {
      setIsLoading(true);
      console.log("Iniciando tentativa de login...");

      // 1. Busca a string do usuário salvo no AsyncStorage
      const storageData = await AsyncStorage.getItem('@UserStorage');

      if (!storageData) {
        alert("Nenhum usuário encontrado. Por favor, cadastre-se primeiro.");
        return;
      }

      // 2. Converte de volta para um objeto JavaScript
      const savedUser = JSON.parse(storageData);
      console.log("Dados recuperados para comparação:", savedUser.email);

      // 3. Valida se o que foi digitado agora é igual ao que salvamos no cadastro
      if (email === savedUser.email && password === savedUser.password) {
        console.log("LOGIN CORRETO! Tentando mudar de tela..."); // <--- Adicione isso
        router.push("/tabs/home");
      } else {
        alert("E-mail ou senha incorretos.");
      }

    } catch (error) {
      console.log("Erro ao acessar o storage no Login:", error);
      alert("Ocorreu um problema técnico ao entrar.");
    } finally {
      setIsLoading(false);
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
            source={require("../assets/9518505.jpg")}
            resizeMode="contain"
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

            <Button
              label={isLoading ? "Carregando..." : "Entrar"}
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>

          <Text style={styles.footerText}>
            Não tem uma conta?{" "}
            <Link href="/auth/signup" style={styles.footerLink}>
              Cadastre-se aqui.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    padding: 32,
    justifyContent: 'center',
  },
  illustration: {
    width: "100%",
    height: 250,
  },
  header: {
    marginTop: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#1A1A1E"
  },
  subtitle: {
    fontSize: 16,
    color: "#71717A",
    marginTop: 4
  },
  form: {
    marginTop: 32,
    gap: 16
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 4,
  },
  footerText: {
    textAlign: "center",
    marginTop: 32,
    color: "#585860"
  },
  footerLink: {
    color: "#032ad7",
    fontWeight: "700"
  },
});