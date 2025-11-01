import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import TodoListScreen from "./src/screens/TodoListScreen";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import TodoListScreen from "./src/screens/TodoListScreen";
// import EditTodoScreen from "./src/screens/EditTodoScreen";

// --------------------------
// 1️⃣ Define all route names and their expected params.
// This gives TypeScript type safety for navigation and route objects.
// If a screen takes params, you declare them here.
export type RootStackParamList = {
  Home: undefined; // Home screen takes no params
  Edit: { id: number }; // Edit screen needs an id (number)
};

// --------------------------
// 2️⃣ Create the Stack Navigator
// You pass your type (RootStackParamList) so navigation is type-safe.
const Stack = createNativeStackNavigator<RootStackParamList>();

// --------------------------
// 3️⃣ Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      {/* The NavigationContainer wraps your entire navigation tree. */}
      <NavigationContainer>
        {/* Stack.Navigator holds all your screens that can be navigated between */}
        <Stack.Navigator>
          {/* Each Stack.Screen registers one screen in your stack */}
          <Stack.Screen
            name="Home" // Route name
            component={TodoListScreen} // What component renders for this route
            options={{ title: "Todos" }} // Config for header title
          />

          {/* <Stack.Screen
          name="Edit"
          component={EditTodoScreen}
          options={{ title: "Edit Todo" }}
        /> */}
        </Stack.Navigator>

        {/* The StatusBar adjusts colors/icons at the top of the phone screen */}
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
