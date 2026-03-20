import AsyncStorage from "@react-native-async-storage/async-storage"; // Ajustado
import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link, useRouter } from "expo-router"; // Importamos o useRouter
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
  const router = useRouter(); // Hook para navegação no Expo Router
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  // 1. Schema de validação
  const signupSchema = z.object({
    name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  // 2. Função de Cadastro Corrigida
 async function handleSignUp() {
    try {
      console.log("1. Iniciando processo...");
      setErrors({});

      // Pegamos os dados dos inputs
      const data = { name, email, password, confirmPassword };
      
      // Validamos com o Zod
      const validation = signupSchema.safeParse(data);

      if (!validation.success) {
        const formattedErrors = validation.error.flatten().fieldErrors;
        setErrors(formattedErrors);
        console.log("Erro de validação:", formattedErrors);
        return;
      }

      console.log("2. Validado com sucesso! Salvando...");

      const newUser = { email, password, name };

      // 1. Salva no Storage
      await AsyncStorage.setItem('@UserStorage', JSON.stringify(newUser));
      console.log("3. Usuário salvo no AsyncStorage!");
      
      // 2. SÓ AGORA mostramos o alerta de sucesso e redirecionamos
      Alert.alert(
        "Sucesso", 
        "Cadastro realizado com sucesso!", 
        [
          { 
            text: "Ir para Login", 
            onPress: () => {
              console.log("4. Navegando para o Login...");
              router.replace("/auth" as any); 
            }
          }
        ]
      );
      
    } catch (e: any) {
      console.error("ERRO NO CADASTRO:", e);
      Alert.alert("Erro Crítico", "Não foi possível salvar os dados.");
    }
  }

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
            source={require("src/app/assets/3962434.jpg")}
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

            <Button label="Cadastrar" onPress={handleSignUp} />
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
    height: 300, // Ajustei a altura para não empurrar o form pra fora em telas menores
    resizeMode: "contain",
    marginTop: 40,
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