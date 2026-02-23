import { Pressable, View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
}

export function ToggleSwitch({
  value,
  onValueChange,
  activeColor = "#7FFF00",
  inactiveColor = "#E5E7EB",
  thumbColor = "#FFFFFF",
}: ToggleSwitchProps) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 6,
      tension: 40,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Animated.View
        style={{
          width: 52,
          height: 28,
          borderRadius: 14,
          backgroundColor,
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: thumbColor,
            transform: [{ translateX }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
