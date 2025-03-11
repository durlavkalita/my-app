import { Stack } from "expo-router";

export default function TaskLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ title: "Calendar" }} />
    </Stack>
  );
}
