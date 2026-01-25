import Cookie from "@/Util/Cookie";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import AuthApi from "../components/AuthApi";
import { NavBarRight } from "./component/NavBar";

export default function RootLayout() {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const [theme, setTheme] = React.useState("light");

  const fetchCookie = async () => {
    const token = await Cookie.get("SCOM");
    // check if token exists and is valid
    if (!token || token === "{}" || token === "null") {
      return "";
    } else {
      return token;
    }
  };

  React.useEffect(() => {
    const init = async () => {
      const token = await fetchCookie(); // await the async function
      setIsAuthenticated(!!token); // true if token exists
      console.log("Token:", token);

      try {
        const res = await fetch("https://hostnplay.com/api/userData", {
          method: "GET",
          // credentials: 'include' is not needed in React Native fetch
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const responseJSON = await res.json();

        if (responseJSON.length === 0) return;
        setUserData(responseJSON);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    init();
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
        <Stack.Screen
          name="index"
          options={{
            title: "Find Games",
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "login",
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="Game/game"
          options={{
            title: "title",
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "signup",
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
      </Stack>
    </AuthApi.Provider>
  );
}
