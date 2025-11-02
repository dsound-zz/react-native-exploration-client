import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotesScreen from "./screens/NotesScreen";

export type NotesStackParamList = {
  NotesList: undefined;
};

const Stack = createNativeStackNavigator<NotesStackParamList>();

export default function NotesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotesList"
        component={NotesScreen}
        options={{ title: "Notes" }}
      />
    </Stack.Navigator>
  );
}

