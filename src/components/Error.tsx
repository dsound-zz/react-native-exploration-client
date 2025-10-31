import { View, Button, StyleSheet, Text } from "react-native";

export default function Error({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={{ color: "red" }}>{message}</Text>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
});
