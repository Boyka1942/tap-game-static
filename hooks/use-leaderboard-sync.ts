import { useEffect } from "react";
import { useWallet } from "@/lib/wallet-context";
import { useGame } from "@/lib/game-context";
import { trpc } from "@/lib/trpc";

/**
 * Hook to sync player data with the leaderboard when wallet is connected
 */
export function useLeaderboardSync() {
  const { address, isConnected } = useWallet();
  const { state } = useGame();
  const upsertPlayer = trpc.leaderboard.upsertPlayer.useMutation();

  useEffect(() => {
    if (!isConnected || !address) return;

    // Sync player data when tokens change
    const syncData = async () => {
      try {
        await upsertPlayer.mutateAsync({
          walletAddress: address,
          totalTokens: state.totalTokens,
          lastGameTaps: state.lastGameStats?.taps,
          lastGameTokens: state.lastGameStats?.tokensEarned,
        });
      } catch (error) {
        console.error("Failed to sync leaderboard:", error);
      }
    };

    syncData();
  }, [address, isConnected, state.totalTokens, state.lastGameStats]);

  return { isConnected, address };
}
