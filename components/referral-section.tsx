import { View, Text, Pressable, Share, Platform, Linking, Alert } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useGame } from "@/lib/game-context";
import { useAudio } from "@/hooks/use-audio";
import * as WebBrowser from "expo-web-browser";

interface ReferralSectionProps {
  referralCode?: string;
  className?: string;
}

export function ReferralSection({ referralCode = "UPTOKEN", className }: ReferralSectionProps) {
  const colors = useColors();
  const { state, dispatch } = useGame();
  const { playBoost } = useAudio();

  const handleTwitterShare = async () => {
    // Use %0A for newlines instead of \n for better Telegram compatibility
    const text = `🚀 I'm earning $UP tokens with the UP Token Tap Game! Tap as fast as you can and earn crypto rewards. Join me!%0A%0Afollow @uperc20 #UP%0A#Upwego #earn #crypto #freecrypto%0AWebsite: upwegoeth.xyz%0A%0AGame: https://upwegotaptap.netlify.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    try {
      // Open Twitter
      if (Platform.OS === "web") {
        // For web, open in new window and show dialog after a delay
        window.open(url, "_blank");
        
        // Wait 2 seconds before showing dialog (gives user time to switch to Twitter)
        setTimeout(() => {
          // Show dialog when user likely returns
          const confirmed = window.confirm(
            "Did you post the tweet?\n\nClick OK to activate your Twitter Boost (7 tokens per tap for next round)!"
          );
          
          if (confirmed) {
            activateBoost();
          }
        }, 2000);
      } else {
        // For mobile, use WebBrowser which returns when user comes back
        const result = await WebBrowser.openBrowserAsync(url);
        
        // Show confirmation dialog after user returns from browser
        Alert.alert(
          "Twitter Boost",
          "Did you post the tweet?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes, I posted it!",
              onPress: () => activateBoost(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error opening Twitter:", error);
    }
  };

  const activateBoost = () => {
    // Queue Twitter boost for next round: 7 tokens per tap for 30 seconds
    dispatch({ type: "QUEUE_TWITTER_BOOST" });
    
    // Play boost sound
    if (state.soundEnabled) {
      playBoost();
    }
    
    // Show success message
    console.log("Twitter boost queued! Next round: 7 tokens per tap for 30 seconds!");
  };

  const handleTikTokShare = async () => {
    // TikTok share typically opens the app or web
    const url = "http://tiktok.com/@upcoineth";
    try {
      if (Platform.OS === "web") {
        window.open(url, "_blank");
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error("Error opening TikTok:", error);
    }
  };

  const handleTelegramJoin = async () => {
    const url = "https://t.me/EthereumUpwego";
    try {
      if (Platform.OS === "web") {
        window.open(url, "_blank");
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error("Error opening Telegram:", error);
    }
  };

  const handleCopyReferralCode = async () => {
    await Share.share({
      message: `Join me on UP Token Tap Game! Use my referral code: ${referralCode}`,
      title: "UP Token Tap Game",
    });
  };

  return (
    <View className={`gap-3 ${className}`}>
      <Text className="text-lg font-semibold text-foreground">Share & Earn</Text>
      <Text className="text-sm text-muted mb-2">Invite friends and earn bonus tokens!</Text>

      {/* Share Buttons Row */}
      <View className="flex-row gap-2">
        {/* Twitter Button */}
        <Pressable
          onPress={handleTwitterShare}
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

        {/* TikTok Button */}
        <Pressable
          onPress={handleTikTokShare}
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
          <Text className="text-white font-semibold text-center text-sm">📱 Follow</Text>
        </Pressable>

        {/* Telegram Button */}
        <Pressable
          onPress={handleTelegramJoin}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: "#0088cc",
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 10,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-center text-sm">✈️ Join</Text>
        </Pressable>
      </View>

      {/* Referral Code Card */}
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-xs text-muted mb-2">Your Referral Code</Text>
        <View className="flex-row justify-between items-center gap-2">
          <Text className="text-lg font-bold text-foreground flex-1">{referralCode}</Text>
          <Pressable
            onPress={handleCopyReferralCode}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-xs">Share</Text>
          </Pressable>
        </View>
      </View>

      {/* Bonus Info */}
      <View className="bg-warning/10 rounded-2xl p-3 border border-warning">
        <Text className="text-xs text-foreground font-semibold mb-1">💰 Referral Bonus</Text>
        <Text className="text-xs text-muted">
          Earn 10% bonus tokens for each friend who joins using your code!
        </Text>
      </View>
    </View>
  );
}
