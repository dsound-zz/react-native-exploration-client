import { Modal } from "./Modal";
import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import { colors, typography } from "../utils/typography";
import { TodoTypes } from "../types/todoTypes";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  todo: TodoTypes | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  visible,
  onClose,
  todo,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!todo) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Delete Todo"
      closeOnBackdropPress={!isDeleting}
      showCloseButton={!isDeleting}
    >
      <View style={styles.container}>
        <Text style={styles.message}>
          Are you sure you want to delete "{todo.title}"?
        </Text>
        <Text style={styles.warning}>This action cannot be undone.</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={onClose}
              title="Cancel"
              backgroundColor={colors.surface}
              color={colors.textPrimary}
              disabled={isDeleting}
              accessibilityLabel="Cancel delete"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={onConfirm}
              title="Delete"
              backgroundColor={colors.delete}
              color={colors.background}
              disabled={isDeleting}
              accessibilityLabel="Confirm delete"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: "center",
  },
  warning: {
    ...typography.small,
    color: colors.delete,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
});

