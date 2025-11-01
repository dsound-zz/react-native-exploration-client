import { View, StyleSheet } from "react-native";
import Button from "./Button";
import Input from "./Input";

interface SimpleFormProps {
  value: string;
  onChangeValue: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitTitle?: string;
  isSubmitting: boolean;
  accessibilityLabel?: string;
  disableSubmit?: boolean;
}

export default function SimpleForm({
  value,
  onChangeValue,
  onSubmit,
  placeholder = "Enter value",
  submitTitle = "Submit",
  isSubmitting,
  accessibilityLabel = "submit form",
  disableSubmit = false,
}: SimpleFormProps) {
  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChangeValue}
        placeholder={placeholder}
        returnKeyType="done"
      />
      <Button
        onPress={onSubmit}
        title={submitTitle}
        accessibilityLabel={accessibilityLabel}
        disabled={!value || isSubmitting || disableSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    padding: 5,
    margin: 8,
  },
});
