import { useEffect, useRef } from "react";
import { useAudioPlayer, AudioPlayer } from "expo-audio";
import { Platform } from "react-native";

export function useAudio() {
  const tapPlayer = useAudioPlayer(require("@/assets/sounds/tap.wav"));
  const successPlayer = useAudioPlayer(require("@/assets/sounds/success.wav"));
  const boostPlayer = useAudioPlayer(require("@/assets/sounds/boost.wav"));

  useEffect(() => {
    // Enable playback in iOS silent mode
    if (Platform.OS === "ios") {
      import("expo-audio").then(({ setAudioModeAsync }) => {
        setAudioModeAsync({ playsInSilentMode: true });
      });
    }

    // Cleanup
    return () => {
      tapPlayer.release();
      successPlayer.release();
      boostPlayer.release();
    };
  }, []);

  const playTap = () => {
    try {
      tapPlayer.seekTo(0);
      tapPlayer.play();
    } catch (error) {
      console.error("Error playing tap sound:", error);
    }
  };

  const playSuccess = () => {
    try {
      successPlayer.seekTo(0);
      successPlayer.play();
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  };

  const playBoost = () => {
    try {
      boostPlayer.seekTo(0);
      boostPlayer.play();
    } catch (error) {
      console.error("Error playing boost sound:", error);
    }
  };

  return {
    playTap,
    playSuccess,
    playBoost,
  };
}
