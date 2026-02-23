import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface ClaimProgressBarProps {
  currentTokens: number;
  threshold?: number;
}

export function ClaimProgressBar({ currentTokens, threshold = 100000000 }: ClaimProgressBarProps) {
  const colors = useColors();
  
  // Calculate progress percentage (cap at 100%)
  const progress = Math.min((currentTokens / threshold) * 100, 100);
  const tokensNeeded = Math.max(threshold - currentTokens, 0);
  const progressPercentage = progress.toFixed(1);

  return (
    <View className="gap-2">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-foreground">
          Progress to Claim
        </Text>
        <Text className="text-xs font-semibold" style={{ color: "#7FFF00" }}>
          {progressPercentage}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-border rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: "#7FFF00",
          }}
        />
      </View>

      {/* Info Text */}
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-muted">
          {currentTokens.toLocaleString()} / {threshold.toLocaleString()}
        </Text>
        {tokensNeeded > 0 ? (
          <Text className="text-xs text-muted">
            {tokensNeeded.toLocaleString()} more needed
          </Text>
        ) : (
          <Text className="text-xs font-semibold" style={{ color: "#7FFF00" }}>
            ✓ Ready to claim!
          </Text>
        )}
      </View>
    </View>
  );
}
