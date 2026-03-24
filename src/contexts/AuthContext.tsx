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

  useEffect(() => {
    async function setup() {
      try {
        // Inicializa o banco de dados antes de qualquer coisa
        await initDatabase();
        // Aqui você poderia carregar um usuário salvo no Storage (opcional)
      } catch (e) {
        console.error("Erro ao inicializar:", e);
      } finally {
        setLoading(false);
      }
    }
    setup();
  }, []);

  async function signIn(email: string, password: string) {
    const foundUser = await getUserByEmail(email);
    if (!foundUser || foundUser.password !== password) {
      throw new Error("E-mail ou senha inválidos.");
    }
    setUser(foundUser);
  }

  async function signUp(name: string, email: string, password: string) {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    await createUser({
      name,
      email,
      password,
      is_admin: false
    });
  }

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