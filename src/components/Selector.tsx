import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";

type SelectorProps<T> = {
  items: T[];
  labelKey?: T extends Record<string, any> ? keyof T : never;
  valueKey?: T extends Record<string, any> ? keyof T : never;
  selectedValue: any;
  onSelect: (value: any) => void;
};

export function Selector<T>({
  items,
  labelKey,
  valueKey,
  selectedValue,
  onSelect,
}: SelectorProps<T>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue ?? undefined}
        onValueChange={(value) => onSelect(value)}
        {...(Platform.OS === "android" && {
          mode: "dropdown" as const,
          dropdownIconColor: "#666",
        })}
      >
        {selectedValue == null && (
          <Picker.Item label="Select an item..." value={null} />
        )}
        {items.map((item, index) => {
          if (item == null) return null;

          const isObject = typeof item === "object" && !Array.isArray(item);

          const label =
            labelKey && isObject && item !== null
              ? String((item as Record<string, any>)[labelKey as string])
              : String(item);

          const value =
            valueKey && isObject && item !== null
              ? (item as Record<string, any>)[valueKey as string]
              : item;

          return <Picker.Item key={index} label={label} value={value} />;
        })}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === "android" && {
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
      minHeight: 50,
      justifyContent: "center",
      width: "100%",
    }),
    ...(Platform.OS === "ios" && {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      width: "100%",
      height: 216,
    }),
  },
});
