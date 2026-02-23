import { Text, View, Pressable, Alert } from "react-native";
import { useWallet } from "@/lib/wallet-context";
import { useGame } from "@/lib/game-context";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

const CLAIM_THRESHOLD = 100000000; // 100 million tokens required to claim

export function WalletSection() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { state, dispatch } = useGame();
  const colors = useColors();
  const [isClaiming, setIsClaiming] = useState(false);

  const getPlayer = trpc.leaderboard.getPlayer.useQuery(
    { walletAddress: address || "" },
    { enabled: false } // Don't auto-fetch, only fetch manually
  );

  // Load tokens from database when wallet is connected (including auto-restore from localStorage)
  useEffect(() => {
    if (isConnected && address) {
      // Load player data from database
      getPlayer.refetch().then((result) => {
        if (result.data && result.data.totalTokens > 0) {
          // Restore tokens from database
          dispatch({ type: "SET_TOTAL_TOKENS", payload: result.data.totalTokens });
          console.log(`Restored ${result.data.totalTokens} tokens for wallet ${address}`);
        }
      }).catch((error) => {
        console.error("Error loading tokens:", error);
      });
    }
  }, [isConnected, address]);

  const handleConnectWallet = async () => {
    await connectWallet(async (walletAddress) => {
      // Load tokens from database when wallet connects
      try {
        const player = await getPlayer.refetch();
        if (player.data && player.data.totalTokens > 0) {
          // Restore tokens from database
          dispatch({ type: "SET_TOTAL_TOKENS", payload: player.data.totalTokens });
          Alert.alert(
            "Wallet Connected",
            `Welcome back! You have ${player.data.totalTokens.toLocaleString()} UP tokens.`
          );
        }
      } catch (error) {
        console.error("Error loading tokens:", error);
      }
    });
  };

  const canClaim = state.totalTokens >= CLAIM_THRESHOLD;
  const tokensNeeded = CLAIM_THRESHOLD - state.totalTokens;

  const handleClaim = async () => {
    if (!canClaim) {
      Alert.alert(
        "Not Enough Tokens",
        `You need ${tokensNeeded.toLocaleString()} more tokens to claim. Keep playing!`
      );
      return;
    }

    setIsClaiming(true);
    try {
      // TODO: Send claim request to backend
      // For now, show success message
      Alert.alert(
        "Claim Request Submitted!",
        `Your claim for ${state.totalTokens.toLocaleString()} UP tokens has been submitted. You will receive your tokens within 24 hours at:\n\n${address}`,
        [{ text: "OK" }]
      );
      
      // Log claim request (in production, this would go to your backend)
      console.log("Claim request:", {
        wallet: address,
        tokens: state.totalTokens,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert("Error", "Failed to submit claim request. Please try again.");
      console.error("Claim error:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <View className="gap-4">
      {/* Wallet Connection */}
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-lg font-bold text-foreground mb-3">💼 Wallet</Text>
        
        {!isConnected ? (
          <View>
            <Text className="text-sm text-muted mb-3">
              Connect your wallet to claim UP tokens
            </Text>
            <Pressable
              onPress={handleConnectWallet}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-background font-semibold text-center">
                Connect Wallet
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Connected:</Text>
              <Text className="text-sm font-mono text-foreground">
                {formatAddress(address!)}
              </Text>
            </View>
            
            <Pressable
              onPress={disconnectWallet}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.border,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-muted font-semibold text-center text-sm">
                Disconnect
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Claim Section */}
      {isConnected && (
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-3">🎁 Claim Tokens</Text>
          
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Your Tokens:</Text>
              <Text className="text-lg font-bold text-foreground">
                {state.totalTokens.toLocaleString()} UP
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Required:</Text>
              <Text className="text-sm font-semibold text-foreground">
                {CLAIM_THRESHOLD.toLocaleString()} UP
              </Text>
            </View>

            {!canClaim && (
              <View className="bg-warning/10 rounded-lg p-3 mt-2">
                <Text className="text-sm text-warning text-center">
                  ⚠️ You need {tokensNeeded.toLocaleString()} more tokens to claim
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleClaim}
              disabled={!canClaim || isClaiming}
              style={({ pressed }) => [
                {
                  backgroundColor: canClaim ? colors.success : colors.border,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  opacity: pressed ? 0.8 : !canClaim ? 0.5 : 1,
                  marginTop: 8,
                },
              ]}
            >
              <Text className="text-background font-semibold text-center">
                {isClaiming ? "Processing..." : canClaim ? "Claim Tokens" : "Not Eligible Yet"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Minimum Threshold Message */}
      <View className="bg-primary/10 rounded-xl p-4 border border-primary/20">
        <Text className="text-sm text-center text-foreground leading-relaxed">
          💎 <Text className="font-bold">Minimum 100,000,000 tokens</Text> required to claim.{"\n"}
          Keep tapping to reach the threshold!
        </Text>
      </View>
    </View>
  );
}
