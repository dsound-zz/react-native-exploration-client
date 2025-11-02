import { useState, useEffect } from "react";
import { TodoTypes } from "../../../types/todoTypes";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
} from "../services/api";

export function useTodos() {
  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [todosLoading, setTodosLoading] = useState<boolean>(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [todo, setTodo] = useState<TodoTypes["title"]>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<TodoTypes | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<TodoTypes | null>(null);
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
    if (!editingTodo) return;

    setIsSubmitting(true);
    setTodosError(null);
    const trimmedTitle = updatedTitle?.trim();
    if (!trimmedTitle) {
      setIsSubmitting(false);
      return;
    }
    try {
      const updatedTodo = await updateTodo(editingTodo.id, trimmedTitle);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setEditingTodo(null);
    } catch (error: unknown) {
      setTodosError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  }
  async function onDelete() {
    if (!todoToDelete) return;

    // Optimistic update: immediately remove from UI
    const todoIdToDelete = todoToDelete.id;
    const previousTodos = [...todos];

    setTodos((prev) => prev.filter((todo) => todo.id !== todoIdToDelete));
    setTodoToDelete(null);

    // Then sync with database
    try {
      setIsDeleting(true);
      setTodosError(null);
      await deleteTodo(todoIdToDelete);
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
  return {
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
    todoToDelete,
    setTodoToDelete,
    setEditingTodo,
    isDeleting,
    isSubmitting,
    editingTodo,
  };
}
