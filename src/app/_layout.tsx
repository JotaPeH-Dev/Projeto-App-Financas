import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, Slot, useSegments } from "expo-router";
import { View, Text } from "react-native";


function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  console.log("ESTADO ATUAL:", { user, loading, segment: segments[0] });

useEffect(() => {
  if (loading) return;

  // Pegamos o primeiro segmento e forçamos como 'any' para evitar o erro de overlap
  const currentSegment = segments[0] as any;

  // No Expo Router, a tela 'index.tsx' na raiz costuma resultar em um segmento undefined ou vazio
  const isAtLoginPage = !currentSegment || currentSegment === "index" || currentSegment === "";
  const isAtSignupPage = currentSegment === "signup";

  console.log("DEBUG - User:", !!user, "Segmento:", currentSegment);

  if (!user && !isAtLoginPage && !isAtSignupPage) {
    // Se não tem user e não está no login/signup -> Vai para a raiz (Login)
    router.replace("/");
  } 
  else if (user && (isAtLoginPage || isAtSignupPage)) {
    // Se tem user e tenta entrar no login/signup -> Vai para a Home
    // IMPORTANTE: Verifique se o arquivo app/home.tsx existe!
    router.replace("/home");
  }
}, [user, loading, segments]);

// Enquanto carrega o login, mostramos nada (ou um componente de loading/spinner)
if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando configurações...</Text> 
    </View>
  );
}

return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="signup" />
    <Stack.Screen name="home" /> 
  </Stack>
);
}

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
  