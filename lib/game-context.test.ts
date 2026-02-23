import { describe, it, expect } from "vitest";

// Mock game state and reducer logic
interface GameState {
  totalTokens: number;
  currentTaps: number;
  gameActive: boolean;
  timeRemaining: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

type GameAction =
  | { type: "SET_TOTAL_TOKENS"; payload: number }
  | { type: "ADD_TOKENS"; payload: number }
  | { type: "INCREMENT_TAPS" }
  | { type: "RESET_TAPS" }
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "SET_TIME_REMAINING"; payload: number }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_HAPTICS" };

const initialState: GameState = {
  totalTokens: 0,
  currentTaps: 0,
  gameActive: false,
  timeRemaining: 0,
  soundEnabled: true,
  hapticsEnabled: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_TOTAL_TOKENS":
      return { ...state, totalTokens: action.payload };
    case "ADD_TOKENS":
      return { ...state, totalTokens: state.totalTokens + action.payload };
    case "INCREMENT_TAPS":
      return { ...state, currentTaps: state.currentTaps + 1 };
    case "RESET_TAPS":
      return { ...state, currentTaps: 0 };
    case "START_GAME":
      return { ...state, gameActive: true, currentTaps: 0, timeRemaining: 30 };
    case "END_GAME":
      return { ...state, gameActive: false };
    case "SET_TIME_REMAINING":
      return { ...state, timeRemaining: action.payload };
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    case "TOGGLE_HAPTICS":
      return { ...state, hapticsEnabled: !state.hapticsEnabled };
    default:
      return state;
  }
}

describe("Game Context Reducer", () => {
  describe("Token Management", () => {
    it("should set total tokens", () => {
      const state = gameReducer(initialState, { type: "SET_TOTAL_TOKENS", payload: 100 });
      expect(state.totalTokens).toBe(100);
    });

    it("should add tokens to existing balance", () => {
      let state = gameReducer(initialState, { type: "SET_TOTAL_TOKENS", payload: 50 });
      state = gameReducer(state, { type: "ADD_TOKENS", payload: 25 });
      expect(state.totalTokens).toBe(75);
    });

    it("should add tokens starting from zero", () => {
      const state = gameReducer(initialState, { type: "ADD_TOKENS", payload: 10 });
      expect(state.totalTokens).toBe(10);
    });
  });

  describe("Tap Counting", () => {
    it("should increment tap counter", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      state = gameReducer(state, { type: "INCREMENT_TAPS" });
      state = gameReducer(state, { type: "INCREMENT_TAPS" });
      expect(state.currentTaps).toBe(2);
    });

    it("should reset tap counter", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      state = gameReducer(state, { type: "INCREMENT_TAPS" });
      state = gameReducer(state, { type: "INCREMENT_TAPS" });
      state = gameReducer(state, { type: "RESET_TAPS" });
      expect(state.currentTaps).toBe(0);
    });
  });

  describe("Game State Management", () => {
    it("should start game with correct initial values", () => {
      const state = gameReducer(initialState, { type: "START_GAME" });
      expect(state.gameActive).toBe(true);
      expect(state.currentTaps).toBe(0);
      expect(state.timeRemaining).toBe(30);
    });

    it("should end game", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      expect(state.gameActive).toBe(true);
      state = gameReducer(state, { type: "END_GAME" });
      expect(state.gameActive).toBe(false);
    });

    it("should update time remaining", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      state = gameReducer(state, { type: "SET_TIME_REMAINING", payload: 15 });
      expect(state.timeRemaining).toBe(15);
    });
  });

  describe("Settings Management", () => {
    it("should toggle sound setting", () => {
      let state = gameReducer(initialState, { type: "TOGGLE_SOUND" });
      expect(state.soundEnabled).toBe(false);
      state = gameReducer(state, { type: "TOGGLE_SOUND" });
      expect(state.soundEnabled).toBe(true);
    });

    it("should toggle haptics setting", () => {
      let state = gameReducer(initialState, { type: "TOGGLE_HAPTICS" });
      expect(state.hapticsEnabled).toBe(false);
      state = gameReducer(state, { type: "TOGGLE_HAPTICS" });
      expect(state.hapticsEnabled).toBe(true);
    });
  });

  describe("Game Flow", () => {
    it("should complete a full game flow", () => {
      let state = initialState;

      // Start game
      state = gameReducer(state, { type: "START_GAME" });
      expect(state.gameActive).toBe(true);
      expect(state.currentTaps).toBe(0);

      // Simulate taps
      for (let i = 0; i < 50; i++) {
        state = gameReducer(state, { type: "INCREMENT_TAPS" });
      }
      expect(state.currentTaps).toBe(50);

      // Simulate time passing
      state = gameReducer(state, { type: "SET_TIME_REMAINING", payload: 0 });
      expect(state.timeRemaining).toBe(0);

      // End game
      state = gameReducer(state, { type: "END_GAME" });
      expect(state.gameActive).toBe(false);

      // Award tokens (50 taps / 5 = 10 tokens)
      state = gameReducer(state, { type: "ADD_TOKENS", payload: 10 });
      expect(state.totalTokens).toBe(10);
    });

    it("should handle multiple games", () => {
      let state = initialState;

      // First game
      state = gameReducer(state, { type: "START_GAME" });
      for (let i = 0; i < 30; i++) {
        state = gameReducer(state, { type: "INCREMENT_TAPS" });
      }
      state = gameReducer(state, { type: "END_GAME" });
      state = gameReducer(state, { type: "ADD_TOKENS", payload: 6 }); // 30 / 5 = 6
      expect(state.totalTokens).toBe(6);

      // Second game
      state = gameReducer(state, { type: "START_GAME" });
      for (let i = 0; i < 25; i++) {
        state = gameReducer(state, { type: "INCREMENT_TAPS" });
      }
      state = gameReducer(state, { type: "END_GAME" });
      state = gameReducer(state, { type: "ADD_TOKENS", payload: 5 }); // 25 / 5 = 5
      expect(state.totalTokens).toBe(11);
    });
  });
});
