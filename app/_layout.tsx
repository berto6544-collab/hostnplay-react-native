import { Stack } from "expo-router";
import React from "react";
import AuthApi from "../components/AuthApi";
export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = React.useState("");
  const [userData, setUserData] = React.useState([]);

  return (
    <AuthApi.Provider
      value={{ isAuthenticated, setIsAuthenticated, userData, setUserData }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: "Find Games" }} />
        <Stack.Screen name="login" options={{ title: "login" }} />
        <Stack.Screen name="Game/title" options={{ title: "title" }} />
        <Stack.Screen name="signup" options={{ title: "signup" }} />
      </Stack>
    </AuthApi.Provider>
  );
}
