import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/contexts/AuthContext';
import { addTransaction } from 'src/database/database';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para atualizar a lista na Home
}

export function AddTransactionModal({ visible, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSave = async () => {
  if (!description || !amount) {
    Alert.alert("Erro", "Preencha todos os campos.");
    return;
  }

  try {
    const numericValue = parseFloat(amount.replace(',', '.'));

    // PASSANDO COMO UM ÚNICO OBJETO (O ARGUMENTO QUE ELE ESPERA)
    await addTransaction({
      label: description,      // Mapeia 'description' para 'label'
      value: numericValue,     // Mapeia 'amount' para 'value'
      type: type,
      date: new Date().toISOString(),
      user_id: Number(user?.id)
    });

    Alert.alert("Sucesso", "Transação salva!");
    onSuccess(); 
    onClose();
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao salvar no banco.");
  }
};

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Nova Movimentação</Text>

          <TextInput
            style={styles.input}
            placeholder="Descrição (ex: Almoço)"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Valor (ex: 50.00)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.incomeActive]}
              onPress={() => setType('income')}
            >
              <Text style={type === 'income' ? styles.whiteText : styles.blackText}>Entrada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.expenseActive]}
              onPress={() => setType('expense')}
            >
              <Text style={type === 'expense' ? styles.whiteText : styles.blackText}>Saída</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  content: { backgroundColor: '#FFF', borderRadius: 20, padding: 25 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 15 },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeButton: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, marginHorizontal: 5, borderWidth: 1, borderColor: '#DDD' },
  incomeActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  expenseActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  whiteText: { color: '#FFF', fontWeight: 'bold' },
  blackText: { color: '#000' },
  saveButton: { backgroundColor: '#032ad7', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#71717A' }
});