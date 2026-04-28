import { useAuth } from "@/contexts/AuthContext";
import { TransactionService, Transaction } from "@/database/TransactionService"; // Importe o tipo Transaction
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react"; // Adicionado useEffect
import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
}

export function AddTransactionModal({ visible, onClose, onSuccess, transaction }: Props) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [displayValue, setDisplayValue] = useState("R$ 0,00");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formata o valor para exibição em Real
  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const amount = Number(cleanValue) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleAmountChange = (text: string) => {
    setDisplayValue(formatCurrency(text));
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // 🧠 Monitora se é edição ou nova transação
  useEffect(() => {
    if (transaction && visible) {
      setDescription(transaction.label);
      // Converte o valor numérico de volta para o formato de máscara (ex: 10.50 -> 1050)
      const valueInCents = (transaction.value * 100).toFixed(0);
      setDisplayValue(formatCurrency(valueInCents));
      setType(transaction.type);
      setDate(new Date(transaction.date));
    } else if (visible) {
      setDescription("");
      setDisplayValue("R$ 0,00");
      setType("expense");
      setDate(new Date());
    }
  }, [transaction, visible]);

  const handleSave = async () => {
    const numericValue = Number(displayValue.replace(/\D/g, "")) / 100;

    if (!description || numericValue <= 0) {
      Alert.alert("Atenção", "Preencha a descrição e um valor válido.");
      return;
    }

    try {
      if (transaction) {
        // Lógica de ATUALIZAÇÃO
        await TransactionService.updateTransaction(
          transaction.id,
          description,
          numericValue,
          type,
          date.toISOString()
        );
        Alert.alert("Sucesso", "Movimentação atualizada!");
      } else {
        // Lógica de INSERÇÃO
        await TransactionService.addTransaction(
          Number(user?.id),
          description,
          numericValue,
          type,
          date.toISOString()
        );
        Alert.alert("Sucesso", "Movimentação salva!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao processar no banco.");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {transaction ? "Editar Movimentação" : "Nova Movimentação"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              keyboardType="numeric"
              value={displayValue}
              onChangeText={handleAmountChange}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.blackText}>
                Data: {date.toLocaleDateString("pt-BR")}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.incomeActive,
                ]}
                onPress={() => setType("income")}
              >
                <Text style={type === "income" ? styles.whiteText : styles.blackText}>
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
                <Text style={type === "expense" ? styles.whiteText : styles.blackText}>
                  Saída
                </Text>
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
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingInline: 20, // 🧠 Logical Property
  },
  content: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBlockEnd: 20, // 🧠 Logical Property
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBlockEnd: 15, // 🧠 Logical Property
    fontSize: 16,
    justifyContent: "center",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBlockEnd: 20,
  },
  typeButton: {
    flex: 1,
    paddingBlock: 12, // 🧠 Logical Property
    alignItems: "center",
    borderRadius: 10,
    marginInline: 5,  // 🧠 Logical Property
    borderWidth: 1,
    borderColor: "#DDD",
  },
  incomeActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  expenseActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  whiteText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  blackText: {
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#032ad7",
    paddingBlock: 15, // 🧠 Logical Property
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginBlockStart: 15, // 🧠 Logical Property
    alignItems: "center",
  },
  cancelText: {
    color: "#71717A",
  },
});