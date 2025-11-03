import React, { useState, useMemo } from "react";
import DropDownPicker from "react-native-dropdown-picker";

type SelectorProps<T> = {
  items: T[];
  labelKey?: keyof T;
  valueKey?: keyof T;
  selectedValue: any;
  onSelect: (value: any) => void;
  placeholder?: string;
};

export function Selector<T>({
  items,
  labelKey,
  valueKey,
  selectedValue,
  onSelect,
  placeholder = "Select an item...",
}: SelectorProps<T>) {
  const [open, setOpen] = useState(false);

  // Transform items into the format expected by react-native-dropdown-picker
  const dropdownItems = useMemo(() => {
    if (!items?.length) return [];

    // Check if items already have label and value properties (pre-formatted)
    const firstItem = items[0];
    const isPreFormatted =
      firstItem &&
      typeof firstItem === "object" &&
      !Array.isArray(firstItem) &&
      "label" in firstItem &&
      "value" in firstItem;

    if (isPreFormatted) {
      // Items are already in the correct format, just filter nulls and add None
      const validItems = items
        .filter((item) => item != null)
        .map((item) => ({
          label: String((item as any).label),
          value: (item as any).value,
        }));

      return [{ label: "None", value: null }, ...validItems];
    }

    // Original logic for items that need transformation
    // First, filter out null items and extract the key values
    const validItems = items.filter((item) => item != null);

    // Get unique values based on valueKey (or the item itself if no valueKey)
    const uniqueValues = Array.from(
      new Set(
        validItems.map((item) => {
          const isObject = typeof item === "object" && !Array.isArray(item);
          return valueKey && isObject
            ? (item as Record<string, any>)[valueKey as string]
            : item;
        })
      )
    );

    // Map unique values back to dropdown items
    const regularItems = uniqueValues.map((value) => {
      // Find the first item that matches this value to get the label
      const matchingItem = validItems.find((item) => {
        const isObject = typeof item === "object" && !Array.isArray(item);
        const itemValue =
          valueKey && isObject
            ? (item as Record<string, any>)[valueKey as string]
            : item;
        return itemValue === value;
      });

      if (!matchingItem) {
        return { label: String(value), value };
      }

      const isObject =
        typeof matchingItem === "object" && !Array.isArray(matchingItem);
      const label =
        labelKey && isObject
          ? String((matchingItem as Record<string, any>)[labelKey as string])
          : String(value);

      return { label, value };
    });

    // Add 'none' option at the beginning
    return [{ label: "None", value: null }, ...regularItems];
  }, [items, labelKey, valueKey]);

  if (!items?.length) return null;

  return (
    <DropDownPicker
      open={open}
      value={selectedValue}
      items={dropdownItems}
      setOpen={setOpen}
      setValue={(callback) => {
        // react-native-dropdown-picker uses a callback pattern
        if (typeof callback === "function") {
          const newValue = callback(selectedValue);
          onSelect(newValue === null ? null : newValue);
        } else {
          onSelect(callback === null ? null : callback);
        }
      }}
      onChangeValue={(value) => {
        // Backup handler in case setValue doesn't fire
        if (value !== undefined) {
          onSelect(value === null ? null : value);
        }
      }}
      placeholder={placeholder}
      style={{
        borderColor: "#E0E0E0",
        borderRadius: 8,
      }}
      dropDownContainerStyle={{
        borderColor: "#E0E0E0",
        borderRadius: 8,
      }}
      textStyle={{
        fontSize: 16,
      }}
    />
  );
}
