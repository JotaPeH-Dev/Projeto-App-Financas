import { StyleSheet, TextInput, TextInputProps } from "react-native";

export function Input(props: TextInputProps) {
  return <TextInput style={styles.input} placeholder={props.placeholder} />
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    paddingLeft: 16,
  },
});