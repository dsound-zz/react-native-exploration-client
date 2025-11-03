import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { TodoTypes } from "../../../types/todoTypes";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import EditTodoModal from "../components/EditTodoModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

import { View, FlatList, Text } from "react-native";
import SimpleForm from "../../../components/SimpleForm";
import ScreenContainer from "../../../components/ScreenContainer";
import { colors, typography } from "../../../utils/typography";
import Icon from "../../../components/Icon";
import { useTodos } from "../hooks/useTodos";
import { getDate } from "../../../utils/dateFormatter";
import { Selector } from "../../../components/Selector";

export default function TodoListScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "done" | "incompleted" | "title"
  >("all");
  const {
    todo,
    todos,
    setTodo,
    todosLoading,
    todosError,
    onSubmit,
    loadTodos,
    onUpdate,
    onComplete,
    onDelete,
    isDeleting,
    isSubmitting,
    editingTodo,
    setEditingTodo,
    setTodoToDelete,
    todoToDelete,
  } = useTodos();

  const visibleTodos = useMemo(() => {
    let results = [...todos];
    if (filterType === "done") results = results.filter((t) => t.done);
    if (filterType === "incompleted") results = results.filter((t) => !t.done);
    if (filterType === "title")
      results = results.sort((a, b) => a.title.localeCompare(b.title));

    return results;
  }, [todos, filterType]);

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
      <View
        style={{
          marginVertical: 6,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <Selector
          items={
            todos.length > 0
              ? [
                  ...Object.keys(todos[0])
                    .filter((key) => key !== "id" && key !== "created_at")
                    .map((key) => ({
                      label:
                        key === "done"
                          ? "Completed"
                          : key[0].toUpperCase() + key.slice(1),
                      value: key,
                    })),
                  {
                    label: "Incompleted",
                    value: "incompleted",
                  },
                ]
              : []
          }
          selectedValue={filterType}
          onSelect={(value) => setFilterType(value)}
        />
      </View>
      <FlatList
        data={visibleTodos}
        renderItem={({ item }) => (
          <Item
            todo={item}
            setIsEditing={setEditingTodo}
            onDelete={setTodoToDelete}
            onComplete={onComplete}
            isSubmitting={isSubmitting}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ width: "100%" }}
      />
      {editingTodo && (
        <EditTodoModal
          visible={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          title="Edit Todo"
          editableTodo={editingTodo}
          onSubmit={onUpdate}
          isSubmitting={isSubmitting}
        />
      )}
      {todoToDelete && (
        <DeleteConfirmModal
          visible={!!todoToDelete}
          onClose={() => setTodoToDelete(null)}
          todo={todoToDelete}
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
  const { title, done, created_at } = todo;

  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.textContainer}>
        <Text style={[typography.h3, itemStyles.todoText]} numberOfLines={1}>
          {title || "Untitled"}
        </Text>
        <Text style={[typography.small, itemStyles.createdAt]}>
          {getDate(created_at)}
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
  createdAt: {
    color: colors.textSecondary,
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
