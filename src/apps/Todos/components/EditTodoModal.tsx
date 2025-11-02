import { useEffect, useState } from "react";
import { TodoTypes } from "../../../types/todoTypes";
import { Modal } from "../../../components/Modal";
import SimpleForm from "../../../components/SimpleForm";

interface EditTodoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  editableTodo: TodoTypes;
  onSubmit: (updatedTitle: string) => void;
  isSubmitting: boolean;
}

export default function EditTodoModal({
  visible,
  onClose,
  title,
  editableTodo,
  onSubmit,
  isSubmitting,
}: EditTodoModalProps) {
  const [todo, setTodo] = useState<TodoTypes["title"]>("");

  useEffect(() => {
    if (visible) {
      setTodo(editableTodo.title ?? "");
    }
  }, [visible, editableTodo.id, editableTodo.title]);

  const hasChanged = todo.trim() !== (editableTodo.title ?? "").trim();

  return (
    <Modal visible={visible} onClose={onClose} title={title}>
      <SimpleForm
        value={todo}
        onChangeValue={setTodo}
        placeholder="Edit todo"
        isSubmitting={isSubmitting}
        onSubmit={() => onSubmit(todo)}
        disableSubmit={!hasChanged}
      />
    </Modal>
  );
}
