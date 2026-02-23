import { ScrollView, Text, View, ActivityIndicator, Pressable, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function LeaderboardScreen() {
  const colors = useColors();
  const { data: players, isLoading, refetch } = trpc.leaderboard.getAll.useQuery();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">🏆 Leaderboard</Text>
            <Text className="text-base text-muted text-center">
              Top UP Token Earners
            </Text>
          </View>

          {/* Refresh Button */}
          <Pressable
            onPress={handleRefresh}
            disabled={refreshing}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                opacity: pressed ? 0.8 : refreshing ? 0.5 : 1,
                alignSelf: "center",
              },
            ]}
          >
            <Text className="text-background font-semibold text-center">
              {refreshing ? "Refreshing..." : "🔄 Refresh"}
            </Text>
          </Pressable>

          {/* Loading State */}
          {isLoading && (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-muted mt-4">Loading leaderboard...</Text>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && (!players || players.length === 0) && (
            <View className="items-center justify-center py-12 bg-surface rounded-2xl border border-border">
              <Text className="text-4xl mb-4">🎮</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">
                No Players Yet
              </Text>
              <Text className="text-sm text-muted text-center px-6">
                Be the first to connect your wallet and start earning UP tokens!
              </Text>
            </View>
          )}

          {/* Leaderboard List */}
          {!isLoading && players && players.length > 0 && (
            <View className="gap-3">
              {players.map((player, index) => (
                <View
                  key={player.id}
                  className="bg-surface rounded-2xl p-4 border border-border"
                  style={
                    index < 3
                      ? {
                          borderColor: colors.primary,
                          borderWidth: 2,
                          backgroundColor: index === 0 ? "#7FFF00" : undefined,
                        }
                      : undefined
                  }
                >
                  <View className="flex-row items-center justify-between">
                    {/* Rank */}
                    <View className="w-12">
                      <Text
                        className="text-2xl font-bold"
                        style={{
                          color: index === 0 ? "#1a1a1a" : colors.foreground,
                        }}
                      >
                        {getRankEmoji(index)}
                      </Text>
                    </View>

                    {/* Player Info */}
                    <View className="flex-1 mx-3">
                      <Text
                        className="text-sm font-mono mb-1"
                        style={{
                          color: index === 0 ? "#1a1a1a" : colors.foreground,
                        }}
                      >
                        {formatAddress(player.walletAddress)}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{
                          color: index === 0 ? "#1a1a1a" : colors.muted,
                        }}
                      >
                        {player.lastGameTaps ? `Last game: ${player.lastGameTaps} taps` : ""}
                      </Text>
                    </View>

                    {/* Tokens */}
                    <View className="items-end">
                      <View className="flex-row items-center gap-1">
                        <Text
                          className="text-2xl font-bold"
                          style={{
                            color: index === 0 ? "#1a1a1a" : "#7FFF00",
                          }}
                        >
                          {player.totalTokens.toLocaleString()}
                        </Text>
                        <Image
                          source={require("@/assets/images/up-coin.png")}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        className="text-xs"
                        style={{
                          color: index === 0 ? "#1a1a1a" : colors.muted,
                        }}
                      >
                        UP Tokens
                      </Text>
                    </View>
                  </View>

                  {/* Full Wallet Address (for admin) */}
                  <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
                    <Text
                      className="text-xs font-mono"
                      style={{
                        color: index === 0 ? "#1a1a1a" : colors.muted,
                      }}
                    >
                      Wallet: {player.walletAddress}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Info Message */}
          <View className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-4">
            <Text className="text-sm text-center text-foreground leading-relaxed">
              💡 <Text className="font-bold">Admin Note:</Text> All wallet addresses are visible for reward distribution.
              Players must connect their wallet to appear on the leaderboard.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
