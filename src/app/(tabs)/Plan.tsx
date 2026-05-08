import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { BudgetService } from '@/database/BudgetService'; 
import { getActiveCategories } from '@/database/database'; // Importe a nova função
import { MaterialIcons } from '@expo/vector-icons';

export default function PlanoScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]); // Lista dinâmica
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState(""); // Estado para o novo item

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      // Busca categorias que já têm limite no banco
      const existingCats = await getActiveCategories(user.id);
      
      // Categorias padrão que você sempre quer mostrar
      const defaultCats = ["Alimentação", "Transporte", "Moradia", "Lazer"];
      
      // Une as padrões com as customizadas (removendo duplicatas)
      const combined = Array.from(new Set([...defaultCats, ...existingCats]));
      
      setCategories(combined);

      // Carrega os valores dos limites
      const budgetData = await BudgetService.fetchBudgets(user.id);
      const budgetMap: Record<string, string> = {};
      budgetData.forEach(item => {
        budgetMap[item.category_name] = item.limit_value.toString();
      });
      setBudgets(budgetMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCustomCategory = () => {
    if (newCategory.trim() === "") return;
    
    if (categories.includes(newCategory.trim())) {
      Alert.alert("Aviso", "Esta categoria já existe.");
      return;
    }

    setCategories([newCategory.trim(), ...categories]);
    setNewCategory(""); // Limpa o campo
  };

  const handleSaveLimit = async (category: string) => {
    if (!user?.id) return;
    const value = budgets[category] || "0";
    const numericValue = parseFloat(value.replace(',', '.'));

    try {
      await BudgetService.updateLimit(user.id, category, numericValue);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item: categoria }: { item: string }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.categoryName}>{categoria}</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.currency}>R$</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0,00"
          value={budgets[categoria] || ""}
          onChangeText={(text) => setBudgets({ ...budgets, [categoria]: text })}
          onBlur={() => handleSaveLimit(categoria)}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Meu Plano Mensal</Text>
        
        {/* Campo para Adicionar Novo Item */}
        <View style={styles.addSection}>
          <TextInput
            style={styles.addInput}
            placeholder="Ex: Obra, Viagem..."
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCustomCategory}>
            <MaterialIcons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#18181B', marginBottom: 15 },
  addSection: { flexDirection: 'row', gap: 10 },
  addInput: { 
    flex: 1, 
    backgroundColor: '#F4F4F5', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 48,
    borderWidth: 1,
    borderColor: '#E4E4E7'
  },
  addButton: { 
    backgroundColor: '#032ad7', 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#18181B' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F4F4F5', 
    borderRadius: 10, 
    paddingHorizontal: 10,
    width: 110
  },
  currency: { color: '#71717A', fontSize: 12 },
  input: { flex: 1, height: 40, fontWeight: 'bold', textAlign: 'right' },
});