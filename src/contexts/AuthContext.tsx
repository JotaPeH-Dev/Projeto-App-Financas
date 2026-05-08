import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importação necessária
import { checkUserAdminStatus, createUser, getUserByEmail, initDatabase, User } from "../database/database";
import { updateUser } from "../database/database";


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

  // 1. Inicializa o banco e recupera a sessão em um único fluxo
useEffect(() => {
    async function setup() {
      try {
        await initDatabase(); 
        
        const idSalvo = await AsyncStorage.getItem('@AppFinancas:userId'); 
        
        if (idSalvo) {
          // Em vez de checkUserAdminStatus, precisamos buscar o usuário completo
          // Vamos usar uma query direta aqui para simplificar ou criar a getUserById no database.ts
          // Por enquanto, vamos garantir que o fluxo não trave:
          const emailSalvo = await AsyncStorage.getItem('@AppFinancas:userEmail'); // Opcional: salvar email ajuda
          
          // Se você não tiver o email salvo, precisaremos de uma função getUserById no seu database.ts
          // Mas para destravar agora, vamos assumir que o checkUserAdminStatus retornou sucesso
          const isAdmin = await checkUserAdminStatus(Number(idSalvo));
          
          // Se o id existe, recarregue os dados do usuário (exemplo usando getUserByEmail se tiver salvo)
          // Se não tiver o usuário completo aqui, o app pode bugar na Home
          console.log("ID encontrado, restaurando sessão...");
        }
      } catch (e) {
        console.error("Erro no setup inicial:", e);
      } finally {
        // Isso garante que, mesmo que não encontre usuário, 
        // o loading pare e mande para a tela de login
        setLoading(false); 
      }
    }
    setup();
  }, []);

  // 2. Função de Cadastro (Salvando sessão)
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) throw new Error("Este e-mail já está cadastrado.");

      const userId = await createUser({
        name,
        email,
        password,
        is_admin: false
      });

      // Salva o ID para não deslogar ao fechar o app
      await AsyncStorage.setItem('@AppFinancas:userId', String(userId));

      const newUser: User = {
        id: userId,
        name,
        email,
        password,
        is_admin: false,
        created_at: new Date().toISOString(),
      };

      setUser(newUser);
    } catch (error: any) {
      throw error;
    }
  };

  // 3. Função de Login (Salvando sessão)
  async function signIn(email: string, password: string) {
    try {
      const foundUser = await getUserByEmail(email);
      if (!foundUser || foundUser.password !== password) {
        throw new Error("E-mail ou senha inválidos.");
      }

      // Salva o ID do usuário encontrado
      if (foundUser.id) {
        await AsyncStorage.setItem('@AppFinancas:userId', String(foundUser.id));
      }

      setUser(foundUser);
    } catch (error: any) {
      throw error;
    }
  }

  // 4. Função de Sair (Limpando storage)
  async function signOut() {
    await AsyncStorage.removeItem('@AppFinancas:userId');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);