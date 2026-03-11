import { Button } from "Components/Button";
import { Input } from "Components/input";
import { Link } from "expo-router";
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
import { z } from "zod";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const signupSchema = z.object({
    name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  function handleSignup() {
    const result = signupSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.container}>
          <Image
            source={require("@/app/assets/3962434.jpg")}
            style={styles.illustration}
          />

          <Text style={styles.title}>Cadastar</Text>
          <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>

          <View style={styles.form}>
            <Input placeholder="Nome"
              onChangeText={setName} value={name} />
            <Input placeholder="E-mail" keyboardType="email-address"
              onChangeText={setEmail} value={email} />
            <Input placeholder="Senha" secureTextEntry
              onChangeText={setPassword} value={password} />
            <Input placeholder="Confirmar Senha" secureTextEntry
              onChangeText={setConfirmPassword} value={confirmPassword} />
            <Button label="Cadastrar" onPress={handleSignup} />
          </View>

          <Text style={styles.footerText}>
            Já tem uma conta? {" "}
            <Link href="/" style={styles.footerLink}>
              Fazer Login.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fDfDfD",
    padding: 32,
  },
  illustration: {
    width: "100%",
    height: 450,
    resizeMode: "contain",
    marginTop: 62,
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginTop: 24,
    gap: 12,
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



})