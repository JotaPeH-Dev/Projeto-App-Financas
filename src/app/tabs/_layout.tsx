import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "src/contexts/AuthContext";

function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verifica em qual pasta o usuário está
    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "tabs";

    if (!user && !inAuthGroup) {
      // 1. Se NÃO está logado e NÃO está na pasta auth -> Vai para o Login
      router.replace("/auth");
    } 
    else if (user && (inAuthGroup || !inTabsGroup)) {
      // 2. Se ESTÁ logado e tenta entrar no Login/Signup -> Vai para a Home
      router.replace("/tabs/home");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#032ad7" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}

// O componente principal exporta o Provider e o conteúdo
export default function Layout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}