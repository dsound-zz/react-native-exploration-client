import { View } from "react-native";

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      {children}
    </View>
  );
}
