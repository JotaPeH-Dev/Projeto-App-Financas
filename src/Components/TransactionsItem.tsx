import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionItemProps {
  data: {
    label: string;
    value: number;
    type: 'income' | 'expense' | 'create';
    date: string;
    cat?: string; // Categoria opcional para despesas
  };
  onDelete: () => void;
}

export default function TransactionsItem({ data, onDelete }: TransactionItemProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', marginBottom: 10, borderRadius: 12 }}>
      <View>
        <Text style={{ fontWeight: 'bold' }}>{data.label}</Text>
        <Text style={{ color: '#71717A', fontSize: 12 }}>{data.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: data.type === 'income' ? '#311de1' : '#EF4444' }}>
          {data.type === 'income' ? '+' : '-'} R$ {data.value.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4e4e7",
  },
  info: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#18181B",
  },
  date: {
    fontSize: 12,
    color: "#71717A",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});