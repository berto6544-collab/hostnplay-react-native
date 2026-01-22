import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Find Games" }} />
      <Stack.Screen name="login" options={{ title: "login" }} />
      <Stack.Screen name="signup" options={{ title: "signup" }} />
    </Stack>
  );
}
