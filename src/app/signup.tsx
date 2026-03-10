import { useState } from "react";
import { z } from "zod";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/input";
import { Link } from "expo-router";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

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
        <Input placeholder="Nome"/>       
        <Input placeholder="E-mail" keyboardType="email-address"/>
        <Input placeholder="Senha" secureTextEntry />
        <Input placeholder="Confirmar Senha" secureTextEntry />
        <Button label="Cadastrar" />
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