import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { useState } from "react";
// Usamos o rest para pegar todas as propriedades (value, onChangeText, keyboardType, etc)
export function Input({ style, ...rest }: TextInputProps) {
  const [newDate, setNewDate] = useState("");

  const handleDateChange = (text: string) => {
    // Remove tudo que não for número
    const cleaned = text.replace(/\D/g, "");

    // Aplica a máscara DD/MM/YYYY
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    setNewDate(formatted);
  };

  return (
    <TextInput 
  placeholder="Data (DD/MM/AAAA)" 
  style={styles.input} 
  value={newDate} 
  onChangeText={handleDateChange} // Usa a função da máscara
  keyboardType="numeric" // Abre o teclado numérico no iPhone
  maxLength={10} // Impede de digitar mais que o necessário
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