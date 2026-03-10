//-----------------------  Importações --------------------------
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/input";
import { Link } from "expo-router";
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

//------------------- Declaração de constantes ---------------
// 1. Defina o schema FORA do componente (Corrigi o nome para loginSchema)
const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
});



//-----------------------  Exportação --------------------------

export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  // Definindo o tipo para o TS não reclamar do 'prev'
  const [errors, setErrors] = useState<any>({});
  const [confirmPassword, setConfirmPassword] = useState(""); 

//------------------- Declaração de funções --------------- 
  function handleLogin() {
    // 2. Use o nome correto da variável aqui
    const result = loginSchema.safeParse({ email, password }); 

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
    } else {
      setErrors({});
      Alert.alert("Bem-vindo", `Login realizado com: ${result.data.email}`);
    }
  }

//------------------- Definição de estilos --------------- 

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
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev: any) => ({ ...prev, email: null }));
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

            <Input 
              placeholder="Senha" 
              secureTextEntry 
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
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FfDfDfD",
    padding: 32,
    justifyContent: 'center',
  },
  illustration: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  header: {
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#1A1A1E",
  },
  subtitle: {
    fontSize: 16,
    color: "#71717A",
    marginTop: 4,
  },
  form: {
    marginTop: 32,
    gap: 16, // O gap ajuda mas precisamos de margem extra para o erro não quebrar o layout
  },
  // 3. Adicione este estilo aqui!
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -12, // Puxa o texto para cima para ficar perto do input
    marginBottom: 4,
  },
  footerText: {
    textAlign: "center",
    marginTop: 32,
    color: "#585860",
  },
  footerLink: {
    color: "#032ad7",
    fontWeight: "700",
  },
});