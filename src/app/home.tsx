import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext"; // Importe o seu hook

export default function Home() {
  const { user, signOut } = useAuth(); // Pegamos o usuário e a função de sair

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          {/* Exibimos o nome que foi definido lá no signIn do Contexto */}
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Minhas Finanças</Text>
        {/* Aqui entrará sua lista de transações depois */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    paddingTop: 60, // Espaço para a barra de status
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: "#71717A",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1E",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#FFE4E6",
    borderRadius: 8,
  },
  logoutText: {
    color: "#E11D48",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1E",
  }
});