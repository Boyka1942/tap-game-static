import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

interface FireAnimationProps {
  size: number;
  active: boolean;
}

export function FireAnimation({ size, active }: FireAnimationProps) {
  const flame1Scale = useSharedValue(0);
  const flame1Opacity = useSharedValue(0);
  const flame2Scale = useSharedValue(0);
  const flame2Opacity = useSharedValue(0);
  const flame3Scale = useSharedValue(0);
  const flame3Opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      // Flame 1 animation
      flame1Scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
          withTiming(1.4, { duration: 150, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      flame1Opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 200 }),
          withTiming(0, { duration: 150 })
        ),
        -1,
        false
      );

      // Flame 2 animation (offset)
      setTimeout(() => {
        flame2Scale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 200, easing: Easing.out(Easing.ease) }),
            withTiming(1.5, { duration: 150, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        flame2Opacity.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 200 }),
            withTiming(0, { duration: 150 })
          ),
          -1,
          false
        );
      }, 100);

      // Flame 3 animation (offset)
      setTimeout(() => {
        flame3Scale.value = withRepeat(
          withSequence(
            withTiming(1.25, { duration: 200, easing: Easing.out(Easing.ease) }),
            withTiming(1.45, { duration: 150, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        flame3Opacity.value = withRepeat(
          withSequence(
            withTiming(0.75, { duration: 200 }),
            withTiming(0, { duration: 150 })
          ),
          -1,
          false
        );
      }, 200);
    } else {
      // Reset animations when not active
      cancelAnimation(flame1Scale);
      cancelAnimation(flame1Opacity);
      cancelAnimation(flame2Scale);
      cancelAnimation(flame2Opacity);
      cancelAnimation(flame3Scale);
      cancelAnimation(flame3Opacity);
      
      flame1Scale.value = 0;
      flame1Opacity.value = 0;
      flame2Scale.value = 0;
      flame2Opacity.value = 0;
      flame3Scale.value = 0;
      flame3Opacity.value = 0;
    }
  }, [active]);

  const flame1Style = useAnimatedStyle(() => ({
    transform: [{ scale: flame1Scale.value }],
    opacity: flame1Opacity.value,
  }));

  const flame2Style = useAnimatedStyle(() => ({
    transform: [{ scale: flame2Scale.value }],
    opacity: flame2Opacity.value,
  }));

  const flame3Style = useAnimatedStyle(() => ({
    transform: [{ scale: flame3Scale.value }],
    opacity: flame3Opacity.value,
  }));

  if (!active) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Flame 1 - Orange */}
      <Animated.View
        style={[
          styles.flame,
          {
            width: size,
            height: size,
            backgroundColor: "#FF6B35",
          },
          flame1Style,
        ]}
      />
      
      {/* Flame 2 - Red-Orange */}
      <Animated.View
        style={[
          styles.flame,
          {
            width: size,
            height: size,
            backgroundColor: "#FF4500",
          },
          flame2Style,
        ]}
      />
      
      {/* Flame 3 - Yellow-Orange */}
      <Animated.View
        style={[
          styles.flame,
          {
            width: size,
            height: size,
            backgroundColor: "#FFA500",
          },
          flame3Style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  flame: {
    position: "absolute",
    borderRadius: 9999,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
});
