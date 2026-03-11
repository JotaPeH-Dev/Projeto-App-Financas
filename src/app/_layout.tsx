import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

function MainLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  
useEffect(() => {
  // 1. Verifique se ainda estamos carregando os dados do AsyncStorage 
  if (loading) return;

  // 2. Pegamos o segmento atual (ex: "home", "login" ou undefined para raiz)
  const currentSegment = segments[0];

  // 3. Se o usuário NÃO ESTÁ LOGADO, redirecionamos para a tela de login
  const isAtRoot = !currentSegment || currentSegment === "(auth)" || currentSegment === "index";
  const isAtSignup = currentSegment === "signup";

  //4. Lógica de proteção de rotas
  if (!user && !isAtRoot && !isAtSignup) {
    // Usuário deslogado tentando acessar area restrita -> redireciona para login (index)
    router.replace("/index");
  } 
  else if (user && (isAtRoot || isAtSignup)) {
    // Usuário logado tentando acessar login ou signup -> redireciona para home
    router.replace("/home");
  }
}, [user, loading, segments]);

// Enquanto carrega o login, mostramos nada (ou um componente de loading/spinner)
if (loading) return null;

return (
  <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="index" />
    <Stack.Screen name="signup" />
    <stack.Screen name="home" />
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
  