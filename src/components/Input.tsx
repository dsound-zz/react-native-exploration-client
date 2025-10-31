import { TextInput, StyleSheet } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  style?: object;
}

export default function Input({
  value,
  onChangeText,
  placeholder = "Enter value",
  returnKeyType = "done",
  style,
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      returnKeyType={returnKeyType}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 8,
  },
});
