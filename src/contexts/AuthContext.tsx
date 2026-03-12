import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storageUser = await AsyncStorage.getItem("@AppFinancas:user");
        if (storageUser) {
          setUser(JSON.parse(storageUser));
        }
      } catch (e) {
        console.error("Erro ao carregar storage", e);
      } finally {
        // ESSENCIAL: Garante que o loading pare mesmo se houver erro ou storage vazio
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true); // Opcional: ativa o loading durante o processo de login

      // Simulando um login (Aqui você faria a chamada para sua API no futuro)
      const data = { id: '1', name: 'João Pedro', email };

      // Salva no storage primeiro para garantir a persistência
      await AsyncStorage.setItem("@AppFinancas:user", JSON.stringify(data));
      setUser(data);

      console.log("Usuário definido no Contexto!:");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // Repassa o erro para o handleLogin tratar com Alert
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem("@AppFinancas:user");
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);