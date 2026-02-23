import { ScrollView, Text, View, Pressable, useWindowDimensions, Image, ImageSourcePropType } from "react-native";
import { useEffect, useState, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ReferralSection } from "@/components/referral-section";
import { WalletSection } from "@/components/wallet-section";
import { ClaimProgressBar } from "@/components/claim-progress-bar";
import { FlyingCoins } from "@/components/flying-coins";
import { useGame } from "@/lib/game-context";
import { useColors } from "@/hooks/use-colors";
import { useLeaderboardSync } from "@/hooks/use-leaderboard-sync";
import { useAudio } from "@/hooks/use-audio";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const colors = useColors();
  const { playTap, playSuccess, playBoost } = useAudio();
  useLeaderboardSync(); // Sync player data with leaderboard
  const { width, height } = useWindowDimensions();
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [coinTrigger, setCoinTrigger] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapScale = useSharedValue(1);

  // Game timer effect
  useEffect(() => {
    if (!state.gameActive) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: "SET_TIME_REMAINING", payload: Math.max(0, state.timeRemaining - 1) });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.gameActive, state.timeRemaining, dispatch]);

  // End game when timer reaches 0
  useEffect(() => {
    if (state.gameActive && state.timeRemaining === 0) {
      endGame();
    }
  }, [state.gameActive, state.timeRemaining]);

  const startGame = () => {
    setGameStarted(true);
    setShowResults(false);
    dispatch({ type: "START_GAME" });
  };

  const endGame = () => {
    dispatch({ type: "END_GAME" });
    // Calculate tokens: 3 tokens per tap normally, 7 tokens per tap during Twitter boost
    const tokensPerTap = state.twitterBoostActive ? 7 : 3;
    const tokensEarned = state.currentTaps * tokensPerTap;
    dispatch({ type: "ADD_TOKENS", payload: tokensEarned });
    dispatch({
      type: "SET_LAST_GAME_STATS",
      payload: { taps: state.currentTaps, tokensEarned },
    });
    setShowResults(true);

    // Haptic feedback on game end
    if (state.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Play success sound
    if (state.soundEnabled) {
      playSuccess();
    }
  };

  const handleTap = () => {
    if (!state.gameActive) return;

    // Haptic feedback on tap
    if (state.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Play tap sound
    if (state.soundEnabled) {
      playTap();
    }

    // Trigger flying coins animation
    setCoinTrigger(prev => prev + 1);

    // Animation feedback
    tapScale.value = withTiming(0.95, { duration: 100 }, () => {
      tapScale.value = withTiming(1, { duration: 100 });
    });

    dispatch({ type: "INCREMENT_TAPS" });
  };

  const animatedTapButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tapScale.value }],
  }));

  const playAgain = () => {
    setShowResults(false);
    startGame();
  };

  const tapButtonSize = Math.min(width * 0.7, height * 0.35);

  if (showResults) {
    const tokensEarned = state.lastGameStats?.tokensEarned || 0;
    return (
      <ScreenContainer className="p-6 justify-center">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View className="items-center gap-8">
            {/* Results Header */}
            <View className="items-center gap-2">
              <Text className="text-4xl font-bold text-foreground">🎉 Game Over!</Text>
              <Text className="text-base text-muted">Check your rewards below</Text>
            </View>

            {/* Stats Cards */}
            <View className="w-full gap-4">
              {/* Taps Card */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-sm text-muted mb-2">Total Taps</Text>
                <Text className="text-4xl font-bold text-foreground">{state.currentTaps}</Text>
              </View>

              {/* UP Tokens Earned Card */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-sm text-muted mb-2">UP Tokens Earned</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-4xl font-bold" style={{ color: "#7FFF00" }}>
                    +{tokensEarned}
                  </Text>
                  <Image
                    source={require("@/assets/images/up-coin.png")}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Total Balance Card */}
              <View className="rounded-2xl p-6" style={{ backgroundColor: "#7FFF00" }}>
                <Text className="text-sm font-semibold mb-2" style={{ color: "#1a1a1a" }}>
                  Total UP Balance
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
                    {state.totalTokens}
                  </Text>
                  <Image
                    source={require("@/assets/images/up-coin.png")}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            {/* Referral Section */}
            <ReferralSection referralCode={`UP${Math.random().toString(36).substring(7).toUpperCase()}`} />

            {/* Play Again Button */}
            <Pressable
              onPress={playAgain}
              style={({ pressed }) => [
                {
                  backgroundColor: "#7FFF00",
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="font-semibold text-lg text-center" style={{ color: "#1a1a1a" }}>
                Play Again
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (!gameStarted) {
    return (
      <ScreenContainer className="p-6 justify-center">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View className="items-center gap-8">
            {/* UP Token Logo */}
            <View className="items-center gap-2">
              <Image
                source={require("@/assets/images/up-token-logo.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
              <Text className="text-4xl font-bold text-foreground">UP Token</Text>
              <Text className="text-base text-muted text-center">Tap Game</Text>
            </View>

            {/* Tagline */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-base text-foreground text-center font-semibold">
                Tap as fast as you can to earn UP tokens! 🎮
              </Text>
            </View>

            {/* Token Balance */}
            <View className="rounded-2xl p-6 w-full" style={{ backgroundColor: "#7FFF00" }}>
              <Text className="text-sm font-semibold mb-2" style={{ color: "#1a1a1a" }}>
                Your UP Balance
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-5xl font-bold" style={{ color: "#1a1a1a" }}>
                  {state.totalTokens}
                </Text>
                <Image
                  source={require("@/assets/images/up-coin.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Claim Progress Bar */}
            <View className="bg-surface rounded-2xl p-6 w-full border border-border">
              <ClaimProgressBar currentTokens={state.totalTokens} />
            </View>

            {/* How to Play */}
            <View className="bg-surface rounded-2xl p-6 w-full border border-border gap-3">
              <Text className="text-lg font-semibold text-foreground">How to Play</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Tap the button as many times as possible in 30 seconds. Each tap earns you 3 UP tokens!
              </Text>
              <Text className="text-xs font-semibold" style={{ color: "#7FFF00" }}>
                💡 Tweet to get 7 tokens per tap for the next full round (30 sec)!
              </Text>
              <View className="mt-2 gap-2">
                <Text className="text-xs text-muted">✓ Tap fast to maximize earnings</Text>
                <Text className="text-xs text-muted">✓ Share with friends for bonus tokens</Text>
                <Text className="text-xs text-muted">✓ Withdraw to your wallet anytime</Text>
              </View>
            </View>

            {/* Referral Section */}
            <ReferralSection referralCode={`UP${Math.random().toString(36).substring(7).toUpperCase()}`} />

            {/* Wallet Section */}
            <WalletSection />

            {/* Boost Pending Indicator */}
            {state.twitterBoostPending && (
              <View className="rounded-2xl p-4 w-full" style={{ backgroundColor: "#1DA1F2" }}>
                <Text className="text-white font-bold text-center text-lg">
                  🚀 BOOST READY!
                </Text>
                <Text className="text-white text-center text-sm mt-1">
                  Next round: 7 tokens per tap for 30 seconds!
                </Text>
              </View>
            )}

            {/* Start Button */}
            <Pressable
              onPress={startGame}
              style={({ pressed }) => [
                {
                  backgroundColor: state.twitterBoostPending ? "#1DA1F2" : "#7FFF00",
                  paddingVertical: 18,
                  paddingHorizontal: 48,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="font-bold text-xl text-center" style={{ color: "#1a1a1a" }}>
                Start Game
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 justify-between">
      {/* Top Section: Token Balance & Timer */}
      <View className="gap-4">
        {/* Token Balance */}
        <View className="rounded-2xl p-4 border border-border flex-row justify-between items-center" style={{ backgroundColor: "#f0f8f0" }}>
          <View>
            <Text className="text-xs text-muted mb-1">Balance</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-2xl font-bold text-foreground">{state.totalTokens}</Text>
              <Image
                source={require("@/assets/images/up-coin.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted mb-1">Time Left</Text>
            <Text className="text-2xl font-bold" style={{ color: "#7FFF00" }}>
              {state.timeRemaining}s
            </Text>
          </View>
        </View>

        {/* Tap Counter */}
        <View className="rounded-2xl p-4" style={{ backgroundColor: "#7FFF00" }}>
          <Text className="text-sm font-semibold mb-2" style={{ color: "#1a1a1a" }}>
            Taps
          </Text>
          <Text className="text-4xl font-bold text-center" style={{ color: "#1a1a1a" }}>
            {state.currentTaps}
          </Text>
        </View>
      </View>

      {/* Middle Section: Tap Button with UP Logo */}
      <View className="flex-1 justify-center items-center">
        {/* Twitter Boost Indicator */}
        {state.twitterBoostActive && (
          <View className="mb-4 rounded-2xl p-4" style={{ backgroundColor: "#1DA1F2" }}>
            <Text className="text-white font-bold text-center text-lg">
              🚀 TWITTER BOOST ACTIVE!
            </Text>
            <Text className="text-white text-center text-sm mt-1">
              7 tokens per tap this round!
            </Text>
          </View>
        )}
        <Animated.View style={animatedTapButtonStyle}>
          {/* Flying Coins Animation */}
          <FlyingCoins trigger={coinTrigger} logoSize={tapButtonSize} />
          
          <Pressable
            onPress={handleTap}
            style={({ pressed }) => [
              {
                width: tapButtonSize,
                height: tapButtonSize,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                backgroundColor: "transparent",
              },
            ]}
          >
            <Image
              source={require("@/assets/images/up-coin.png")}
              style={{
                width: tapButtonSize,
                height: tapButtonSize,
                resizeMode: "contain",
              }}
            />
          </Pressable>
        </Animated.View>
      </View>

      {/* Bottom Section: Stop Button */}
      <View>
        <Pressable
          onPress={endGame}
          style={({ pressed }) => [
            {
              backgroundColor: "#FF6B6B",
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-center">Stop Game</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
