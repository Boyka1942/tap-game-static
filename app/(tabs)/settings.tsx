import { ScrollView, Text, View, Pressable, Linking, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import { useColors } from "@/hooks/use-colors";
import { ToggleSwitch } from "@/components/toggle-switch";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeContext } from "@/lib/theme-provider";
import * as WebBrowser from "expo-web-browser";

export default function SettingsScreen() {
  const { state, dispatch } = useGame();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { setColorScheme } = useThemeContext();

  const toggleSound = () => {
    dispatch({ type: "TOGGLE_SOUND" });
  };

  const toggleHaptics = () => {
    dispatch({ type: "TOGGLE_HAPTICS" });
  };

  const handleVisitWebsite = async () => {
    await WebBrowser.openBrowserAsync("https://upwegoeth.xyz");
  };

  const handleVisitTwitter = async () => {
    await WebBrowser.openBrowserAsync("https://twitter.com/upwegoeth");
  };

  const handleVisitTikTok = async () => {
    await WebBrowser.openBrowserAsync("https://www.tiktok.com/@upwegoeth");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-base text-muted">Customize your experience</Text>
          </View>

          {/* Audio Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Audio</Text>

            {/* Sound Toggle */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">Sound Effects</Text>
                <Text className="text-sm text-muted mt-1">Tap sounds and feedback</Text>
              </View>
              <ToggleSwitch
                value={state.soundEnabled}
                onValueChange={toggleSound}
                activeColor="#7FFF00"
                inactiveColor={colors.border}
              />
            </View>

            {/* Haptics Toggle */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">Haptic Feedback</Text>
                <Text className="text-sm text-muted mt-1">Vibration on taps</Text>
              </View>
              <ToggleSwitch
                value={state.hapticsEnabled}
                onValueChange={toggleHaptics}
                activeColor="#7FFF00"
                inactiveColor={colors.border}
              />
            </View>
          </View>

          {/* Display Settings - Theme locked to dark mode */}

          {/* Game Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Game</Text>

            {/* Game Duration Info */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-base font-medium text-foreground mb-2">Round Duration</Text>
              <Text className="text-sm text-muted">30 seconds per round</Text>
              <Text className="text-xs text-muted mt-2">
                Each tap = 3 UP tokens (7 with Twitter boost)
              </Text>
            </View>
          </View>

          {/* UP Token Links */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">UP Token Community</Text>

            {/* Website Button */}
            <Pressable
              onPress={handleVisitWebsite}
              style={({ pressed }) => [
                {
                  backgroundColor: "#7FFF00",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="font-semibold text-center" style={{ color: "#1a1a1a" }}>
                🌐 Visit Official Website
              </Text>
            </Pressable>

            {/* Social Links Row */}
            <View className="flex-row gap-2">
              {/* Twitter */}
              <Pressable
                onPress={handleVisitTwitter}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: "#1DA1F2",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold text-center text-sm">𝕏 Twitter</Text>
              </Pressable>

              {/* TikTok */}
              <Pressable
                onPress={handleVisitTikTok}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: "#000000",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold text-center text-sm">🎵 TikTok</Text>
              </Pressable>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App Version</Text>
                <Text className="text-sm font-medium text-foreground">1.0.0</Text>
              </View>
              <View className="border-t border-border pt-3">
                <Text className="text-xs text-muted leading-relaxed">
                  UP Token Tap Game is a fun minigame where you can earn UP tokens by tapping as
                  fast as possible. Your progress is saved automatically!
                </Text>
              </View>
            </View>
          </View>

          {/* Contract Info */}
          <View className="gap-3 pb-6">
            <Text className="text-lg font-semibold text-foreground">Token Info</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <View>
                <Text className="text-xs text-muted mb-1">Contract Address</Text>
                <Text className="text-xs font-mono text-foreground break-words">
                  0xf95151526F586dB1c99fb6eBb6392Aa9CFE13f8e
                </Text>
              </View>
              <View className="border-t border-border pt-2 mt-2">
                <Text className="text-xs text-muted mb-1">Network</Text>
                <Text className="text-sm font-medium text-foreground">Ethereum</Text>
              </View>
              <View className="border-t border-border pt-2 mt-2">
                <Text className="text-xs text-muted mb-1">Total Supply</Text>
                <Text className="text-sm font-medium text-foreground">999,999,999,999</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
