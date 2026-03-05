import { Image, StyleSheet, Text, View } from "react-native";

import { Input } from "@/app/Components/input"; 

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/app/assets/9518505.jpg")}
        style={styles.illustration}
      />

      <Text style={styles.title}>Entrar</Text>
      <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>

      <View style={styles.form}>
        <Input placeholder="E-mail"/>
        <Input placeholder="Senha"/>
      </View>
    </View>
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
    height: 330,
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
  }



})