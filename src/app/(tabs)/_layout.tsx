import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // 1. Importação essencial
import { AuthProvider } from '../../contexts/AuthContext';
import { initDatabase } from '../../database/database';

export default function RootLayout() {
  
  useEffect(() => {
    // Inicializa o banco de dados ao abrir o app
    initDatabase()
      .then(() => console.log("Banco de dados pronto!"))
      .catch((err) => console.error("Erro na carga inicial do DB:", err));
  }, []);

  return (
    // 2. O GestureHandlerRootView DEVE envolver tudo para os gestos funcionarem
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}