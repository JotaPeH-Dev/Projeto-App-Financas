import { StyleSheet, TextInput, TextInputProps } from "react-native";

// Usamos o rest para pegar todas as propriedades (value, onChangeText, keyboardType, etc)
export function Input({ style, ...rest }: TextInputProps) {
  return (
    <TextInput 
      style={[styles.input, style]} 
      placeholderTextColor="#71717A" // Dica: melhora a visibilidade do placeholder
      {...rest} // <-- Isso aqui é o segredo! Repassa tudo automaticamente.
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 16, // paddingHorizontal é melhor que paddingLeft para centralizar
    backgroundColor: "#fff", // Fica melhor visualmente no fundo cinza
  },
});