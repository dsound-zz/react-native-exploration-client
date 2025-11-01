import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../lib/api";
import { TodoTypes } from "../types/todoTypes";
import Loading from "../components/Loading";
import Error from "../components/Error";
import EditTodoModal from "./EditTodoModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

import { View, FlatList, Text } from "react-native";
import SimpleForm from "../components/SimpleForm";
import ScreenContainer from "../components/ScreenContainer";
import { colors, typography } from "../lib/typography";
import Icon from "../components/Icon";

export default function TodoListScreen() {
  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [todosLoading, setTodosLoading] = useState<boolean>(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [todo, setTodo] = useState<TodoTypes["title"]>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditingTodo, setIsEditingTodo] = useState<TodoTypes | null>(null);
  const [isDeletingTodo, setIsDeletingTodo] = useState<TodoTypes | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  async function loadTodos() {
    try {
      setTodosLoading(true);
      setTodosError(null);
      const todosData = await getTodos();
      setTodos(todosData ?? []);
    } catch (error: unknown) {
      setTodosError(String(error));
    } finally {
      setTodosLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function onSubmit() {
    setIsSubmitting(true);
    setTodosError(null);
    const trimmedTodo = todo?.trim();
    if (!trimmedTodo) {
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await createTodo(trimmedTodo);
      setTodos((prev) => [...prev, response]);
      setTodo("");
    } catch (error: unknown) {
      setTodosError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onUpdate(updatedTitle: string) {
    if (!isEditingTodo) return;

    setIsSubmitting(true);
    setTodosError(null);
    const trimmedTitle = updatedTitle?.trim();
    if (!trimmedTitle) {
      setIsSubmitting(false);
      return;
    }
    try {
      const updatedTodo = await updateTodo(isEditingTodo.id, trimmedTitle);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setIsEditingTodo(null);
    } catch (error: unknown) {
      setTodosError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  }
  async function onDelete() {
    if (!isDeletingTodo) return;

    // Optimistic update: immediately remove from UI
    const todoToDelete = isDeletingTodo;
    const previousTodos = [...todos];

    setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete.id));
    setIsDeletingTodo(null);

    // Then sync with database
    try {
      setIsDeleting(true);
      setTodosError(null);
      await deleteTodo(todoToDelete.id);
    } catch (error: unknown) {
      // Rollback optimistic update on error
      setTodos(previousTodos);
      setTodosError(String(error));
    } finally {
      setIsDeleting(false);
    }
  }

  async function onComplete(todoToToggle: TodoTypes) {
    // Optimistic update: immediately update the UI
    const previousTodos = [...todos];
    const newDoneState = !todoToToggle.done;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoToToggle.id ? { ...todo, done: newDoneState } : todo
      )
    );

    // Then sync with database
    try {
      setTodosError(null);
      const updatedTodo = await completeTodo(todoToToggle.id, newDoneState);
      // Update with server response (in case server made additional changes)
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    } catch (error: unknown) {
      // Rollback optimistic update on error
      setTodos(previousTodos);
      setTodosError(String(error));
    }
  }

  if (todosLoading) return <Loading />;
  if (todosError) return <Error message={todosError} onRetry={loadTodos} />;

  return (
    <ScreenContainer>
      <View>
        <Text style={typography.h2}>Demian's Todos</Text>
      </View>
      <SimpleForm
        value={todo}
        onChangeValue={setTodo}
        onSubmit={onSubmit}
        placeholder="Enter todo"
        accessibilityLabel="Add Todo"
        isSubmitting={isSubmitting}
      />
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <Item
            todo={item}
            setIsEditing={setIsEditingTodo}
            onDelete={setIsDeletingTodo}
            onComplete={onComplete}
            isSubmitting={isSubmitting}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ width: "100%" }}
      />
      {isEditingTodo && (
        <EditTodoModal
          visible={!!isEditingTodo}
          onClose={() => setIsEditingTodo(null)}
          title="Edit Todo"
          editableTodo={isEditingTodo}
          onSubmit={onUpdate}
          isSubmitting={isSubmitting}
        />
      )}
      {isDeletingTodo && (
        <DeleteConfirmModal
          visible={!!isDeletingTodo}
          onClose={() => setIsDeletingTodo(null)}
          todo={isDeletingTodo}
          onConfirm={onDelete}
          isDeleting={isDeleting}
        />
      )}
    </ScreenContainer>
  );
}

interface ItemProps {
  todo: TodoTypes;
  setIsEditing: (item: TodoTypes) => void;
  onDelete: (item: TodoTypes) => void;
  onComplete: (item: TodoTypes) => void;
  isSubmitting: boolean;
}

function Item({
  todo,
  setIsEditing,
  onDelete,
  onComplete,
  isSubmitting,
}: ItemProps) {
  const { title, done } = todo;
  console.log(title);
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.textContainer}>
        <Text style={[typography.h3, itemStyles.todoText]} numberOfLines={1}>
          {title || "Untitled"}
        </Text>
      </View>
      <View style={iconRowStyles.iconRow}>
        <View style={iconRowStyles.iconWrapper}>
          <Icon
            onPress={() => onComplete(todo)}
            name={done ? "check-box" : "check-box-outline-blank"}
            color={colors.checkbox}
            disabled={isSubmitting}
          />
        </View>
        <View style={iconRowStyles.iconWrapper}>
          <Icon
            onPress={() => setIsEditing(todo)}
            name="edit"
            color={colors.update}
            disabled={isSubmitting}
          />
        </View>
        <View style={iconRowStyles.iconWrapper}>
          <Icon
            onPress={() => onDelete(todo)}
            name="delete"
            color={colors.delete}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    minWidth: 0, // Allows text to shrink
  },
  todoText: {
    color: colors.textPrimary,
  },
});

const iconRowStyles = StyleSheet.create({
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginLeft: 20,
  },
});
