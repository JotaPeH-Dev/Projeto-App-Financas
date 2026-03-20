// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário logado ao abrir o app
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@LoggedUser');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      // 1. Pega o usuário que foi cadastrado na tela de Signup
      const storageUser = await AsyncStorage.getItem('@UserStorage');
      
      if (!storageUser) {
        throw new Error("Nenhum usuário cadastrado.");
      }

      const userData = JSON.parse(storageUser);

      // 2. Compara e valida
      if (userData.email === email && userData.password === password) {
        const loggedUser = { email: userData.email, name: userData.name };
        
        // Salva para o useEffect acima reconhecer na próxima vez que abrir o app
        await AsyncStorage.setItem('@LoggedUser', JSON.stringify(loggedUser));
        
        // Atualiza o estado global (isso dispara o redirecionamento no _layout.tsx)
        setUser(loggedUser);
      } else {
        throw new Error("E-mail ou senha incorretos.");
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@LoggedUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);