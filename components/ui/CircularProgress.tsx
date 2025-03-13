import { View, Text } from "react-native";

export default function CircularProgress({ progress }: { progress: number }) {
  const percentage = Math.round(progress * 100);
  return (
    <View className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center">
      <Text className="text-sm font-bold">{percentage}%</Text>
    </View>
  );
}
