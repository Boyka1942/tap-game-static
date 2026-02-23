import { Text, View, TouchableOpacity, Linking, Platform } from "react-native";
import { useTelegram } from "@/lib/telegram";
import { useColors } from "@/hooks/use-colors";

interface TelegramShareProps {
  message: string;
  url?: string;
  onShare?: () => void;
}

export function TelegramShare({ message, url, onShare }: TelegramShareProps) {
  const { isTelegramEnvironment, shareToStory, openLink } = useTelegram();
  const colors = useColors();

  const handleShare = () => {
    if (isTelegramEnvironment) {
      // In Telegram, use native share
      const shareUrl = url || "https://tap-game-static.vercel.app";
      const fullMessage = `${message}\n\n${shareUrl}`;
      
      // Open Twitter in Telegram's browser
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}`;
      openLink(twitterUrl);
    } else {
      // On web, open Twitter in new tab
      const shareUrl = url || "https://tap-game-static.vercel.app";
      const fullMessage = `${message}\n\n${shareUrl}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}`;
      
      if (Platform.OS === "web") {
        window.open(twitterUrl, "_blank");
      } else {
        Linking.openURL(twitterUrl);
      }
    }

    onShare?.();
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={{
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#000", fontSize: 16, fontWeight: "600" }}>
        🐦 Tweet for Boost
      </Text>
    </TouchableOpacity>
  );
}
