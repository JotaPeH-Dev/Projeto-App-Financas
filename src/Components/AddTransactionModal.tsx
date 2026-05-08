import { useAuth } from "@/contexts/AuthContext";
import { Transaction, TransactionService } from "@/database/TransactionService";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
}

const CATEGORIAS = [
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Moradia",
  "Outros",
  "Investimentos",
  "Salário",
  "Freelance",
  "Presentes",
  "Assinaturas",
  "Viagens",
  "Roupas",
];

export function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
  transaction,
}: AddTransactionModalProps) {
  const { user } = useAuth();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("0,00"); // Valor visual com máscara
  const [rawValue, setRawValue] = useState(0); // Valor numérico real para o banco
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Outros");

  // Lógica da Máscara: Direita para a Esquerda
  const handleValueChange = (text: string) => {
    // Remove tudo que não for dígito
    const cleanText = text.replace(/\D/g, "");

    // Converte para número (centavos)
    const numericValue = Number(cleanText) / 100;

    setRawValue(numericValue);

    // Formata para o padrão BRL visualmente
    const formatted = numericValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValue(formatted);
  };

  useEffect(() => {
    if (transaction) {
      setLabel(transaction.label);
      setRawValue(transaction.value);
      setValue(
        transaction.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      );
      setType(transaction.type);
      setCategory(transaction.category || "Outros");
    } else {
      setLabel("");
      setValue("0,00");
      setRawValue(0);
      setType("expense");
      setCategory("Outros");
    }
  }, [transaction, visible]);

  const handleSave = async () => {
    if (!label || rawValue <= 0 || !user?.id) return;

    try {
      if (transaction) {
        await TransactionService.updateTransaction(
          transaction.id,
          label,
          rawValue, // Enviamos o número limpo (ex: 10.50)
          type,
          transaction.date,
          category,
        );
      } else {
        await TransactionService.addTransaction(
          user.id,
          label,
          rawValue,
          type,
          new Date().toISOString(),
          category,
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {transaction ? "Editar" : "Nova"} Movimentação
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#71717A" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.labelTitle}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Aluguel"
              value={label}
              onChangeText={setLabel}
            />

            <Text style={styles.labelTitle}>Valor (R$)</Text>
            <TextInput
              style={[styles.input, styles.valueInput]}
              keyboardType="numeric"
              value={value}
              onChangeText={handleValueChange}
              selectTextOnFocus={false}
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.incomeActive,
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "income" && styles.textActive,
                  ]}
                >
                  Entrada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.expenseActive,
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" && styles.textActive,
                  ]}
                >
                  Saída
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.labelTitle}>Categoria</Text>
            <View style={styles.categoryWrapper}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#18181B" },
  labelTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#71717A",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F4F4F5",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#18181B",
  },
  valueInput: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#71717A",
  },
  typeContainer: { flexDirection: "row", gap: 12, marginTop: 15 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  incomeActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  expenseActive: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  typeText: { fontWeight: "bold", color: "#71717A" },
  textActive: { color: "#FFF" },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  categoryChipSelected: { backgroundColor: "#032ad7", borderColor: "#032ad7" },
  categoryChipText: { fontSize: 12, color: "#71717A" },
  categoryChipTextSelected: { color: "#FFF", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#032ad7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
