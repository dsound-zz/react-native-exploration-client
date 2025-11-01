import axios from "axios";
import { Platform } from "react-native";
import { TodoTypes } from "../types/todoTypes";

const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const BASE_URL =
  ENV_BASE_URL && ENV_BASE_URL.length > 0
    ? ENV_BASE_URL
    : Platform.OS === "android"
    ? "http://10.0.2.2:4000"
    : "http://localhost:4000";

function logError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Axios request failed", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
}

export async function getTodos(): Promise<TodoTypes[]> {
  console.log(BASE_URL);

  try {
    const response = await axios.get<TodoTypes[]>(`${BASE_URL}/todos`, {
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
}

export async function createTodo(newTitle: string): Promise<TodoTypes> {
  try {
    const response = await axios.post<TodoTypes>(`${BASE_URL}/todos`, {
      title: newTitle,
      done: false,
    });
    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
}

export async function updateTodo(
  todoId: TodoTypes["id"],
  newTitle: TodoTypes["title"]
): Promise<TodoTypes> {
  try {
    const response = await axios.patch<TodoTypes>(
      `${BASE_URL}/todos/${todoId}`,
      {
        id: todoId,
        title: newTitle,
      }
    );
    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
}

export async function completeTodo(
  todoId: TodoTypes["id"],
  done: TodoTypes["done"]
): Promise<TodoTypes> {
  try {
    const response = await axios.patch<TodoTypes>(
      `${BASE_URL}/todos/${todoId}`,
      {
        id: todoId,
        done,
      }
    );
    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
}

export async function deleteTodo(todoId: TodoTypes["id"]): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/todos/${todoId}`, {
      timeout: 8000,
    });
  } catch (error) {
    logError(error);
    throw error;
  }
}
