import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { createTodo, getTodos } from "../lib/api";
import { TodoTypes } from "../types/todoTypes";
import Loading from "../components/Loading";
import Error from "../components/Error";

import { View, FlatList, Text } from "react-native";
import SimpleForm from "../components/SimpleForm";
import ScreenContainer from "../components/ScreenContainer";
import { colors, typography } from "../lib/typography";
import Button from "../components/Button";

export default function TodoListScreen() {
  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [todosLoading, setTodosLoading] = useState<boolean>(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [todo, setTodo] = useState<TodoTypes["title"]>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  async function onUpdate() {}
  async function onDelete() {}
  async function onComplete() {}

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
            onUpdate={onUpdate}
            onDelete={onDelete}
            onComplete={onComplete}
            isSubmitting={isSubmitting}
          />
        )}
        keyExtractor={(item) => String(item.id)}
      />
    </ScreenContainer>
  );
}

interface ItemProps {
  todo: TodoTypes;
  onUpdate: (item: TodoTypes) => void;
  onDelete: (todoId: TodoTypes["id"]) => void;
  onComplete: (todoId: TodoTypes["id"]) => void;
  isSubmitting: boolean;
}

function Item({
  todo,
  onUpdate,
  onDelete,
  onComplete,
  isSubmitting,
}: ItemProps) {
  const { title, done, id } = todo;
  return (
    <View style={itemStyles.container}>
      <Text style={[typography.h3, itemStyles.todoText]}>{title}</Text>
      <Button
        onPress={onUpdate}
        title="Edit"
        backgroundColor={colors.update}
        disabled={isSubmitting}
      />
      <Button
        onPress={() => onDelete(id)}
        title="Delete"
        backgroundColor={colors.delete}
        disabled={isSubmitting}
      />
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: { flexDirection: "row", margin: 10 },
  todoText: { color: colors.secondary },
});
