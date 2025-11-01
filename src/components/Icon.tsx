import { TouchableOpacity, View } from "react-native";
import { colors } from "../lib/typography";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";

interface IconProps {
  onPress?: () => void;
  name: string;
  color?: string;
  disabled?: boolean;
  size?: number;
  iconFamily?: "MaterialIcons" | "Fontisto";
}

export default function Icon({
  onPress,
  name,
  color = colors.textPrimary,
  disabled,
  size = 20,
  iconFamily = "MaterialIcons",
}: IconProps) {
  const accessibilityLabel = name;

  const IconComponent = iconFamily === "Fontisto" ? Fontisto : MaterialIcons;

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
      >
        <IconComponent name={name} color={color} size={size} />
      </TouchableOpacity>
    </View>
  );
}
