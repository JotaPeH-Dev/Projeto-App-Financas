import { z } from "zod";

// Define as regras de validação para o cadastro
export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .transform((name) => {
      // Formata o nome para ter a primeira letra maiúscula (Opcional, mas legal)
      return name
        .trim()
        .split(" ")
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(" ");
    }),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Digite um e-mail válido")
    .toLowerCase(), // Transforma o e-mail para minúsculas
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z
  .string()
  .min(1, "Confirme sua senha"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], 
});