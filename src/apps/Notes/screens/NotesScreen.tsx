import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenContainer from "../../../components/ScreenContainer";
import { typography } from "../../../utils/typography";

export default function NotesScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={typography.h2}>Notes</Text>
        <Text style={typography.body}>Notes app coming soon...</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

