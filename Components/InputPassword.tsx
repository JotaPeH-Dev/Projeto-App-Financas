// components/InputPassword.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Estendemos as propriedades padrão do TextInput
interface InputPasswordProps extends TextInputProps {
  iconColor?: string;
  error?: boolean;
}

export function InputPassword({ iconColor = '#032ad7', error, ...rest }: InputPasswordProps) {
  // Estado local para controlar se a senha está visível ou não
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Função para alternar o estado do ícone e do texto
  function toggleSecureEntry() {
    setSecureTextEntry(prevState => !prevState);
  }

  return (
    <View style={[styles.container, error && styles.containerError]}>
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry} // Controla a visibilidade
        placeholderTextColor="#A1A1AA"
        {...rest} // Passa todas as outras props (value, onChangeText, etc)
      />
      
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconButton}>
        <MaterialCommunityIcons 
          // Altera o ícone baseado no estado
          name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
          size={24} 
          color={error ? '#EF4444' : iconColor} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinha input e ícone horizontalmente
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    width: '100%',
  },
  containerError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 18,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    padding: 18, // Área de toque do ícone
  },
});