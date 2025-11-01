import { View, TouchableOpacity, Text } from "react-native";
import { colors } from "../utils/typography";

export default function Button({
  onPress,
  title,
  backgroundColor = colors.primary,
  color = colors.textPrimary,
  disabled,
  accessibilityLabel = "button",
}: any) {
  return (
    <View
      style={{
        backgroundColor: disabled ? colors.border : backgroundColor,
        justifyContent: "center",
        padding: 5,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
      >
        <Text style={{ color }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
