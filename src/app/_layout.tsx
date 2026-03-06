import { Stack } from "expo-router";
import { AuthProvider } from "@/app/contexts/AuthContext"; // Verifique se o caminho da pasta é context ou contexts

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Aqui você define as telas que o Stack vai gerenciar */}
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        {/* Se você tiver uma tela de home, adicione ela aqui também futuramente */}
      </Stack>
    </AuthProvider>
  );
}