import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { leaderboard } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const leaderboardRouter = router({
  // Get all players on the leaderboard
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const players = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.totalTokens));
    
    return players;
  }),

  // Get a single player by wallet address
  getPlayer: publicProcedure
    .input(z.object({ walletAddress: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const player = await db
        .select()
        .from(leaderboard)
        .where(eq(leaderboard.walletAddress, input.walletAddress))
        .limit(1);

      return player.length > 0 ? player[0] : null;
    }),

  // Update or create player entry
  upsertPlayer: publicProcedure
    .input(
      z.object({
        walletAddress: z.string(),
        totalTokens: z.number(),
        lastGameTaps: z.number().optional(),
        lastGameTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Check if player exists
      const existingPlayer = await db
        .select()
        .from(leaderboard)
        .where(eq(leaderboard.walletAddress, input.walletAddress))
        .limit(1);

      if (existingPlayer.length > 0) {
        // Update existing player
        await db
          .update(leaderboard)
          .set({
            totalTokens: input.totalTokens,
            lastGameTaps: input.lastGameTaps,
            lastGameTokens: input.lastGameTokens,
            lastPlayedAt: new Date(),
          })
          .where(eq(leaderboard.walletAddress, input.walletAddress));
      } else {
        // Create new player
        await db.insert(leaderboard).values({
          walletAddress: input.walletAddress,
          totalTokens: input.totalTokens,
          lastGameTaps: input.lastGameTaps,
          lastGameTokens: input.lastGameTokens,
          lastPlayedAt: new Date(),
        });
      }

      return { success: true };
    }),
});
