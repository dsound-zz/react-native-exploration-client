import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import TodosNavigator from "./src/apps/Todos";
import NotesNavigator from "./src/apps/Notes";
import { colors } from "./src/utils/typography";

// Define all tab route names and their expected params
export type RootTabParamList = {
  Todos: undefined;
  Notes: undefined;
};

// Create the Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          }}
        >
          <Tab.Screen
            name="Todos"
            component={TodosNavigator}
            options={{
              tabBarIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => (
                <MaterialIcons name="check-box" size={size} color={color} />
              ),
              tabBarLabel: "Todos",
            }}
          />
          <Tab.Screen
            name="Notes"
            component={NotesNavigator}
            options={{
              tabBarIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <MaterialIcons name="note" size={size} color={color} />,
              tabBarLabel: "Notes",
            }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
