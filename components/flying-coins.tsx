import { useEffect, useState } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface Coin {
  id: number;
  angle: number;
  distance: number;
}

interface FlyingCoinsProps {
  trigger: number;
  logoSize: number;
}

export function FlyingCoins({ trigger, logoSize }: FlyingCoinsProps) {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    // Generate 6 coins flying in random directions
    const coinCount = 6;
    const newCoins: Coin[] = [];

    for (let i = 0; i < coinCount; i++) {
      newCoins.push({
        id: Date.now() + Math.random() * 10000 + i,
        angle: (360 / coinCount) * i + (Math.random() * 30 - 15), // Evenly distributed with randomness
        distance: 100 + Math.random() * 50, // Random distance 100-150px
      });
    }

    setCoins(newCoins);

    // Remove coins after animation completes
    const timeout = setTimeout(() => {
      setCoins([]);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <View style={styles.container} pointerEvents="none">
      {coins.map((coin) => (
        <FlyingCoin
          key={coin.id}
          angle={coin.angle}
          distance={coin.distance}
          logoSize={logoSize}
        />
      ))}
    </View>
  );
}

interface FlyingCoinProps {
  angle: number;
  distance: number;
  logoSize: number;
}

function FlyingCoin({ angle, distance, logoSize }: FlyingCoinProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start animation immediately
    progress.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate position based on progress
    const currentDistance = distance * progress.value;
    const x = Math.cos(angleRad) * currentDistance;
    // Add gravity effect - coins fall down more as they fly out
    const y = Math.sin(angleRad) * currentDistance + (progress.value * progress.value * 50);

    // Scale: start at 1, end at 0.2
    const scale = 1 - (progress.value * 0.8);
    
    // Rotation: spin as they fly (2 full rotations)
    const rotate = `${progress.value * 720}deg`;
    
    // Opacity: fade out in the last 30% of animation
    const opacity = progress.value < 0.7 ? 1 : (1 - progress.value) / 0.3;

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: scale },
        { rotate: rotate },
      ],
      opacity: Math.max(0, opacity),
    };
  });

  const coinSize = logoSize * 0.35; // Coins are 35% of button size

  return (
    <Animated.View style={[styles.coin, animatedStyle]}>
      <Image
        source={require("@/assets/images/up-coin.png")}
        style={{
          width: coinSize,
          height: coinSize,
          resizeMode: "contain",
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 10,
  },
  coin: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
  },
});
