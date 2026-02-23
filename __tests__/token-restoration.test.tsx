import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { WalletProvider, useWallet } from "../lib/wallet-context";
import { GameProvider, useGame } from "../lib/game-context";
import React from "react";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock Platform
vi.mock("react-native", () => ({
  Platform: { OS: "web" },
  Alert: { alert: vi.fn() },
  Pressable: "Pressable",
  Text: "Text",
  View: "View",
}));

// Mock tRPC
const mockRefetch = vi.fn();
vi.mock("../lib/trpc", () => ({
  trpc: {
    leaderboard: {
      getPlayer: {
        useQuery: () => ({
          data: null,
          refetch: mockRefetch,
        }),
      },
    },
  },
}));

describe("Token Restoration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };
  });

  it("should restore tokens from database when wallet is connected", async () => {
    const testWallet = "0x1234567890123456789012345678901234567890";
    const testTokens = 50000;

    // Mock localStorage to return saved wallet
    (global.localStorage.getItem as any).mockReturnValue(testWallet);

    // Mock database response
    mockRefetch.mockResolvedValue({
      data: {
        walletAddress: testWallet,
        totalTokens: testTokens,
        lastGameTaps: 100,
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WalletProvider>
        <GameProvider>{children}</GameProvider>
      </WalletProvider>
    );

    const { result: gameResult } = renderHook(() => useGame(), { wrapper });

    // Wait for wallet to auto-restore and tokens to load
    await waitFor(
      () => {
        expect(gameResult.current.state.totalTokens).toBe(testTokens);
      },
      { timeout: 3000 }
    );

    // Verify database was queried
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should handle case when player has no tokens in database", async () => {
    const testWallet = "0x1234567890123456789012345678901234567890";

    // Mock localStorage to return saved wallet
    (global.localStorage.getItem as any).mockReturnValue(testWallet);

    // Mock database response with 0 tokens
    mockRefetch.mockResolvedValue({
      data: {
        walletAddress: testWallet,
        totalTokens: 0,
        lastGameTaps: 0,
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WalletProvider>
        <GameProvider>{children}</GameProvider>
      </WalletProvider>
    );

    const { result: gameResult } = renderHook(() => useGame(), { wrapper });

    // Wait a bit to ensure no tokens are set
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Tokens should remain 0 (not restored)
    expect(gameResult.current.state.totalTokens).toBe(0);
  });

  it("should handle database errors gracefully", async () => {
    const testWallet = "0x1234567890123456789012345678901234567890";

    // Mock localStorage to return saved wallet
    (global.localStorage.getItem as any).mockReturnValue(testWallet);

    // Mock database error
    mockRefetch.mockRejectedValue(new Error("Database connection failed"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WalletProvider>
        <GameProvider>{children}</GameProvider>
      </WalletProvider>
    );

    const { result: gameResult } = renderHook(() => useGame(), { wrapper });

    // Wait a bit to ensure error is handled
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Tokens should remain 0 (not crash)
    expect(gameResult.current.state.totalTokens).toBe(0);
  });
});
