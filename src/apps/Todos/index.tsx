import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodoListScreen from "./screens/TodoListScreen";

export type TodosStackParamList = {
  TodoList: undefined;
};

const Stack = createNativeStackNavigator<TodosStackParamList>();

export default function TodosNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TodoList"
        component={TodoListScreen}
        options={{ title: "Todos" }}
      />
    </Stack.Navigator>
  );
}
