import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: "700" },
  h2: { fontSize: 24, fontWeight: "600" },
  h3: { fontSize: 20, fontWeight: "600" },
  body: { fontSize: 16 },
  small: { fontSize: 14, color: "#6b7280" },
});

export const colors = {
  primary: "#1E90FF",
  secondary: "#FF6B6B",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  textPrimary: "#222222",
  textSecondary: "#666666",
  border: "#E0E0E0",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F4433642",
  update: "#0CBDDC",
  delete: "#E78711",
  checkbox: "#4CA",
} as const;

