import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createTransaction } from "src/database/database";
import { useAuth } from "src/contexts/AuthContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para recarregar a lista na Home
}

export function AddTransactionModal({ visible, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  async function handleSave() {
    if (!label || !value || !user?.id) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await createTransaction({
        label,
        value: parseFloat(value.replace(',', '.')),
        type,
        date: new Date().toISOString(),
        user_id: user.id
      });

      Alert.alert("Sucesso", "Transação salva!");
      setLabel('');
      setValue('');
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Nova Transação</Text>

          <TextInput 
            placeholder="Descrição (ex: Aluguel)" 
            style={styles.input} 
            value={label}
            onChangeText={setLabel}
          />

          <TextInput 
            placeholder="Valor (0,00)" 
            keyboardType="numeric" 
            style={styles.input} 
            value={value}
            onChangeText={setValue}
          />

          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'income' && styles.incomeActive]} 
              onPress={() => setType('income')}
            >
              <Text style={type === 'income' ? styles.whiteText : null}>Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.typeButton, type === 'expense' && styles.expenseActive]} 
              onPress={() => setType('expense')}
            >
              <Text style={type === 'expense' ? styles.whiteText : null}>Despesa</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.whiteText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#F4F4F5', padding: 15, borderRadius: 10, marginBottom: 15 },
  typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#F4F4F5' },
  incomeActive: { backgroundColor: '#10B981' },
  expenseActive: { backgroundColor: '#EF4444' },
  saveButton: { backgroundColor: '#311de1', padding: 18, borderRadius: 10, alignItems: 'center' },
  whiteText: { color: '#FFF', fontWeight: 'bold' },
  cancelText: { textAlign: 'center', marginTop: 15, color: '#71717A' }
});