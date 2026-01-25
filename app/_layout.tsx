import Cookie from "@/Util/Cookie";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import AuthApi from "../components/AuthApi";

export default function RootLayout() {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const [theme, setTheme] = React.useState("light");

  const fetchCookie = async () => {
    const token = await Cookie.get("SCOM");
    return token || "";
  };

  React.useEffect(() => {
    const token = fetchCookie();
    setIsAuthenticated(token);
    fetch("https://hostnplay.com/api/userData")
      .then((res) => res.json())
      .then((response) => {
        if (response.length == 0) return;

        setUserData(userData);
      });
  }, []);

  return (
    <AuthApi.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userData,
        setUserData,
        theme,
        setTheme,
      }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ title: "Find Games" }} />
        <Stack.Screen name="login" options={{ title: "login" }} />
        <Stack.Screen name="Game/game" options={{ title: "title" }} />
        <Stack.Screen name="signup" options={{ title: "signup" }} />
      </Stack>
    </AuthApi.Provider>
  );
}
