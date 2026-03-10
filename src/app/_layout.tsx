import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const currentSegment = segments[0] || as string;

if (!user && currentSegment !== "" && currentSegment !== "signup") {
  router.replace("/");}
else if (user && (currentSegment === "" || currentSegment === "signup")) {
  router.replace("/home");
}
  useEffect(() => {
    if (loading) return;

    // Se não tem usuário e não está nas telas de login/cadastro, manda para o login (index)
    if (!user && segments[0] !== "index" && segments[0] !== "signup") {
      router.replace("/");
    } 
    // Se já está logado e tenta voltar pro login ou signup, manda para a home
    else if (user && (segments[0] === "index" || segments[0] === "signup")) {
      router.replace("/home");
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Row name="signup" />
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