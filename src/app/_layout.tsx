import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const currentSegment = segments[0] as string;

if (!user && currentSegment !== "" && currentSegment !== "signup") {
  router.replace("/");}
else if (user && (currentSegment === "" || currentSegment === "signup")) {
  router.replace("/home");
}
  

useEffect(() => {
    if (loading) return;

   // 1. Pegamos o segmento atual e garantimos que o TS aceite como string
    const currentSegment = segments[0] as string;

    // 2. No Expo Router, a raiz (index.tsx) é uma string vazia ou undefined
    const isAtRoot = !currentSegment || currentSegment === "";
    const isAtSignup = currentSegment === "signup";

    // 3. Lógica de Proteção de Rotas
    if (!user && !isAtRoot && !isAtSignup) {
      // Se não está logado e tenta acessar algo que não seja Login ou Signup
      router.replace("/");
    } 
    else if (user && (isAtRoot || isAtSignup)) {
      // Se JÁ está logado e tenta voltar pro Login ou Signup
      router.replace("/home");
    }
  }, [user, loading, segments]);

  // Enquanto estiver carregando o AsyncStorage, não renderizamos nada para evitar "pulos" de tela
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="home" />
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