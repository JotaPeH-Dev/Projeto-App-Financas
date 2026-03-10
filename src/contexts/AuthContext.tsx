import { createContext, ReactNode, useContext, useState } from "react";

//Definição do tipo de usuário
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    //Aqui entra a chamada para a API de autenticação (axios.post('/login'))
    console.log("Tentando logar com':, email");

    //Simulação de resposta da API
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simula um delay de 1,5 segundo
    if (email === "test@test.com" && password === "password") {
      setUser({
        id: "1",
        name: "João Silva",
        email: email,
      });
    } else {
      throw new Error("E-mail ou senha inválidos");

    }
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

//Hook personalizado para facilitar o uso 
export function useAuth() {
  return useContext(AuthContext)
};