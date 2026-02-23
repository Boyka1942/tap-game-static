import { ScrollView, Text, View, Image, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";

export default function StatsScreen() {
  const { state } = useGame();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Your Stats</Text>
            <Text className="text-base text-muted">UP Token earnings overview</Text>
          </View>

          {/* Total Balance - Large Card */}
          <View className="rounded-2xl p-8 gap-2" style={{ backgroundColor: "#7FFF00" }}>
            <Text className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              Total UP Balance
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-5xl font-bold" style={{ color: "#1a1a1a" }}>
                {state.totalTokens}
              </Text>
              <Image
                source={require("@/assets/images/up-coin.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-xs opacity-75 mt-2" style={{ color: "#1a1a1a" }}>
              UP Tokens Earned
            </Text>
          </View>

          {/* Last Game Stats */}
          {state.lastGameStats ? (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Last Game</Text>
              <View className="gap-3">
                {/* Taps */}
                <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
                  <Text className="text-base text-muted">Taps</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {state.lastGameStats.taps}
                  </Text>
                </View>

                {/* Tokens Earned */}
                <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between items-center">
                  <Text className="text-base text-muted">Tokens Earned</Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-2xl font-bold" style={{ color: "#7FFF00" }}>
                      +{state.lastGameStats.tokensEarned}
                    </Text>
                    <Image
                      source={require("@/assets/images/up-coin.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* Time */}
                <View className="bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-base text-muted mb-2">Played At</Text>
                  <Text className="text-sm text-foreground">
                    {new Date(state.lastGameStats.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center">
              <Text className="text-base text-muted text-center">
                No games played yet. Start a game to see your stats!
              </Text>
            </View>
          )}

          {/* UP Token Info */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">About UP Token</Text>
            <View className="gap-2">
              <Text className="text-sm text-muted leading-relaxed">
                🚀 <Text className="font-semibold">Community-Driven</Text> - UP is a meme coin on Ethereum built by the community
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                💰 <Text className="font-semibold">Zero Tax</Text> - No transaction fees, all rewards go to you
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                🔥 <Text className="font-semibold">Burnt LP</Text> - Liquidity pool is burnt for security
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                🌍 <Text className="font-semibold">Ethereum Network</Text> - Built on secure Ethereum blockchain
              </Text>
            </View>
          </View>

          {/* Official Website */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Official Website</Text>
            <Text className="text-sm text-muted leading-relaxed">
              Visit the official UP Token website for more information:
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://upwegoeth.xyz/")}
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold underline" style={{ color: "#7FFF00" }}>
                https://upwegoeth.xyz/
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pro Tips */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Pro Tips</Text>
            <View className="gap-2">
              <Text className="text-sm text-muted leading-relaxed">
                • Tap faster to earn more tokens in 30 seconds
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                • Each tap = 3 UP tokens (normal mode)
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                • 💡 <Text className="font-semibold" style={{ color: "#7FFF00" }}>Twitter Boost:</Text> Tweet to get 7 tokens per tap for the next full round!
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                • Unlimited tweets = unlimited boosts
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                • Your tokens are saved automatically
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                • Connect your wallet to claim tokens at 100,000,000
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
