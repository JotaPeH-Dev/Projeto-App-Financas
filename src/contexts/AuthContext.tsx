import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);


// ... mantenha suas interfaces User e AuthContextData aqui ...

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Estado para saber se estamos lendo do disco

  // BUSCAR DADOS AO ABRIR O APP
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem("@financas:user");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    // Simulação de login
    if (email === "test@test.com" && password === "password") {
      const userData = {
        id: "1",
        name: "João Silva",
        email: email,
      };

      setUser(userData);
      
      // SALVAR NO DISCO
      await AsyncStorage.setItem("@financas:user", JSON.stringify(userData));
    } else {
      throw new Error("E-mail ou senha inválidos");
    }
  }

  async function signOut() {
    // REMOVER DO DISCO
    await AsyncStorage.removeItem("@financas:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Verifique se o 'export' está presente aqui!

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}