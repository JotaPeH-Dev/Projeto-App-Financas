import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUser, getUserByEmail, initDatabase, User } from '../database/database';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAndLoadUser() {
      try {
        // Inicializar banco de dados
        await initDatabase();

        // Carregar usuário logado
        const loggedUserData = await AsyncStorage.getItem('@LoggedUser');
        if (loggedUserData) {
          const loggedUser = JSON.parse(loggedUserData);
          // Buscar dados completos do usuário no banco
          const fullUserData = await getUserByEmail(loggedUser.email);
          if (fullUserData) {
            setUser(fullUserData);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
      } finally {
        setLoading(false);
      }
    }

    initializeAndLoadUser();
  }, []);

  async function signUp(name: string, email: string, password: string) {
    // Verificar se usuário já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("E-mail já cadastrado.");
    }

    // Criar usuário no banco
    const userId = await createUser({
      name,
      email,
      password,
      is_admin: false // Primeiro usuário pode ser admin se quiser
    });

    // Buscar dados do usuário criado
    const newUser = await getUserByEmail(email);
    if (newUser) {
      await AsyncStorage.setItem('@LoggedUser', JSON.stringify({
        email: newUser.email,
        name: newUser.name
      }));
      setUser(newUser);
    }
  }

  async function signIn(email: string, password: string) {
    const userData = await getUserByEmail(email);
    if (!userData) {
      throw new Error("Usuário não encontrado.");
    }

    if (userData.password !== password) {
      throw new Error("Senha incorreta.");
    }

    // Salvar sessão
    await AsyncStorage.setItem('@LoggedUser', JSON.stringify({
      email: userData.email,
      name: userData.name
    }));
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.removeItem('@LoggedUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);