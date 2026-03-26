import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // AQUI ESTAVA O ERRO: Adicione os parênteses para bater com o nome da pasta
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Se deslogou e não está no grupo de login, manda para o index do (auth)
      router.replace("/(auth)/login"); 
    } else if (user && inAuthGroup) {
      // Se logou e está no login, manda para a home
      router.replace("/(tabs)/home");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F4F5" }}>
        <ActivityIndicator size="large" color="#311de1" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* GARANTA que o nome aqui tenha os parênteses exatamente como na pasta */}
      <Stack.Screen name="(auth)" /> 
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}