import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GameState {
  totalTokens: number;
  currentTaps: number;
  gameActive: boolean;
  timeRemaining: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  twitterBoostActive: boolean;
  twitterBoostPending: boolean; // Boost will activate on next round
  twitterBoostTimeRemaining: number;
  lastGameStats: {
    taps: number;
    tokensEarned: number;
    timestamp: number;
  } | null;
}

export type GameAction =
  | { type: "SET_TOTAL_TOKENS"; payload: number }
  | { type: "ADD_TOKENS"; payload: number }
  | { type: "INCREMENT_TAPS" }
  | { type: "RESET_TAPS" }
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "SET_TIME_REMAINING"; payload: number }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_HAPTICS" }
  | { type: "QUEUE_TWITTER_BOOST" } // Queue boost for next round
  | { type: "ACTIVATE_TWITTER_BOOST" } // Activate boost (internal)
  | { type: "SET_TWITTER_BOOST_TIME"; payload: number }
  | { type: "DEACTIVATE_TWITTER_BOOST" }
  | { type: "SET_LAST_GAME_STATS"; payload: { taps: number; tokensEarned: number } }
  | { type: "LOAD_STATE"; payload: Partial<GameState> };

const initialState: GameState = {
  totalTokens: 0,
  currentTaps: 0,
  gameActive: false,
  timeRemaining: 0,
  soundEnabled: true,
  hapticsEnabled: true,
  twitterBoostActive: false,
  twitterBoostPending: false,
  twitterBoostTimeRemaining: 0,
  lastGameStats: null,
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
      // If boost is pending, activate it for this round
      if (state.twitterBoostPending) {
        return {
          ...state,
          gameActive: true,
          currentTaps: 0,
          timeRemaining: 30,
          twitterBoostActive: true,
          twitterBoostPending: false,
          twitterBoostTimeRemaining: 30,
        };
      }
      return { ...state, gameActive: true, currentTaps: 0, timeRemaining: 30 };
    case "END_GAME":
      // Deactivate boost when game ends
      return {
        ...state,
        gameActive: false,
        twitterBoostActive: false,
        twitterBoostTimeRemaining: 0,
      };
    case "SET_TIME_REMAINING":
      return { ...state, timeRemaining: action.payload };
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    case "TOGGLE_HAPTICS":
      return { ...state, hapticsEnabled: !state.hapticsEnabled };
    case "QUEUE_TWITTER_BOOST":
      // Queue boost for next round
      return { ...state, twitterBoostPending: true };
    case "ACTIVATE_TWITTER_BOOST":
      // Internal action to activate boost
      return { ...state, twitterBoostActive: true, twitterBoostTimeRemaining: 30 };
    case "SET_TWITTER_BOOST_TIME":
      return { ...state, twitterBoostTimeRemaining: action.payload };
    case "DEACTIVATE_TWITTER_BOOST":
      return { ...state, twitterBoostActive: false, twitterBoostTimeRemaining: 0 };
    case "SET_LAST_GAME_STATS":
      return {
        ...state,
        lastGameStats: {
          taps: action.payload.taps,
          tokensEarned: action.payload.tokensEarned,
          timestamp: Date.now(),
        },
      };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("gameState");
        if (savedState) {
          const parsed = JSON.parse(savedState);
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    };
    loadState();
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("gameState", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    };
    saveState();
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
