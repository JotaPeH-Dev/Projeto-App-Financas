import  { useState } from "react";
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
  View } 
  from "react-native";

export default function Index() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  function handleLogin() {
   // Alert.alert("Login", "Funcionalidade de Login acionada.")
   if (!email.trim() || !password.trim()) {
     Alert.alert("Erro", "Por favor, preencha e-mail e senha para entrar.");
     return;
   }
 
 Alert.alert("Bem-", `Login realizado com: ${email}`);
 
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require("@/app/assets/9518505.jpg")}
            style={styles.illustration}
          />

          <Text style={styles.title}>Entrar{email}</Text>
          <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>

          <View style={styles.form}>
            <Input 
            placeholder="E-mail" 
            keyboardType="email-address" 
            onChangeText={setEmail} 
            />

            <Input placeholder="Senha" secureTextEntry onChangeText={setPassword}/>
            <Button label="Entrar" onPress={handleLogin} />

          </View>

          <Text style={styles.footerText}>
            Não tem uma conta? {"  "}
            <Link href="/signup" style={styles.footerLink}>
              Cadastre-se aqui.
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
    backgroundColor: "#b41313",
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