import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserByEmail, createUser, User, initDatabase } from "../database/database";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Inicializa o banco de dados ao abrir o app
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        // Dica: Futuramente você pode usar o AsyncStorage aqui para manter o login
      } catch (e) {
        console.error("Erro ao inicializar banco:", e);
      } finally {
        setLoading(false);
      }
    }
    setup();
  }, []);

  // 2. Função de Cadastro (Apenas uma agora!)
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado.");
      }

      const userId = await createUser({ 
        name,
        email,
        password,
        is_admin: false
      });

      const newUser: User = {
        id: userId,
        name,
        email,
        password,
        is_admin: false,
        created_at: new Date().toISOString(),
      };

      setUser(newUser); // Loga o usuário automaticamente após cadastrar
    } catch (error: any) {
      throw error;
    }
  };

  // 3. Função de Login
  async function signIn(email: string, password: string) {
    try {
      const foundUser = await getUserByEmail(email);
      if (!foundUser || foundUser.password !== password) {
        throw new Error("E-mail ou senha inválidos.");
      }
      setUser(foundUser);
    } catch (error: any) {
      throw error;
    }
  }

  // 4. Função de Sair
  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);