import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  console.log("ESTADO ATUAL:", { user, loading, segment: segments[0] });

useEffect(() => {
    if (loading) return;

    // Forçamos o tipo para string para o TS parar de reclamar das rotas automáticas
    const currentSegment = segments[0] as string | undefined;

    // Verificamos se o usuário está em telas públicas (Login ou Cadastro)
    // No Expo Router, a raiz "/" costuma vir como undefined ou "index"
    const isAtRoot = !currentSegment || currentSegment === "index" || currentSegment === "(auth)";
    const isAtSignup = currentSegment === "signup";

    if (!user && !isAtRoot && !isAtSignup) {
      // Se não tem usuário e NÃO está no login/signup -> Vai para o Login
      router.replace("/");
    } 
    else if (user && (isAtRoot || isAtSignup)) {
      // Se TEM usuário e tenta entrar no login/signup -> Vai para a Home
      router.replace("/home");
    }
  }, [user, loading, segments]);

// Enquanto carrega o login, mostramos nada (ou um componente de loading/spinner)
if (loading) return null;

return (
  <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="index" />
    <Stack.Screen name="signup" />
    <Stack.Screen name="home" />
    {/* Se você tiver uma pasta (tabs), mude o nome para "(tabs)" */}
    </Stack>
);
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
  