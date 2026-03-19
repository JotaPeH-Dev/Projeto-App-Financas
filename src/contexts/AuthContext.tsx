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
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // FUNÇÃO DE LOGIN
  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      const data = { id: '1', name: 'João Pedro', email };
      await AsyncStorage.setItem("@AppFinancas:user", JSON.stringify(data));
      setUser(data);
      console.log("Login realizado!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  }

  // FUNÇÃO DE CADASTRO
  async function signUp(email: string, password: string, name: string) {
    try {
      setLoading(true);
      const data = { id: Math.random().toString(), name, email };
      await AsyncStorage.setItem("@AppFinancas:user", JSON.stringify(data));
      setUser(data);
      console.log("Cadastro realizado!");
    } catch (error) {
      console.error("Erro no Contexto ao cadastrar:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // FUNÇÃO DE LOGOUT
  async function signOut() {
    try {
      await AsyncStorage.removeItem("@AppFinancas:user");
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  // ÚNICO RETURN DO COMPONENTE
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);