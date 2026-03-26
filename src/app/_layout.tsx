import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Se não tem usuário, qualquer rota que NÃO comece com (auth) manda pro login
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Forçamos o caminho absoluto com parênteses
      router.replace("/(auth)/" as any);
    } else if (user && inAuthGroup) {
      // Se logou, vai para a home
      router.replace("/(tabs)/home" as any);
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
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