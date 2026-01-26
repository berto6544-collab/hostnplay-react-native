import Cookie from "@/Util/Cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  Compass,
  Gamepad2,
  Gamepad2Icon,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  PlusSquare,
  Settings,
  User,
  User2,
  X,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AuthApi from "../components/AuthApi";
import { NavBarLeft, NavBarRight } from "./component/NavBar";

export default function RootLayout() {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("light");
  const routers = useRouter();
  const { username } = useLocalSearchParams();

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
        isOpen,
        setIsOpen,
      }}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Find Games",
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "login",
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="Game/game"
          options={{
            title: "title",
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="notification"
          options={{
            title: "Notifications",
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="Profile/user"
          options={{
            title: username,
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "signup",
            headerLeft: () => <NavBarLeft />,
            headerRight: () => (
              <NavBarRight token={isAuthenticated} userData={userData} />
            ),
          }}
        />
      </Stack>

      {isOpen && (
        <View
          style={{
            display: "flex",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            padding: 20,
            width: "100%",
            height: "100%",
          }}
        >
          <ScrollView
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: 20,
              gap: 10,
              padding: 10,
              width: "100%",
              overflowY: "auto",
              maxHeight: 500,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                position: "sticky",
                top: 0,
                marginBottom: 10,
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 20 }}></Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <X />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: 10,
                marginBottom: 10,
                gap: 5,
              }}
            >
              <LayoutDashboard />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: 10,
                marginBottom: 10,
                gap: 5,
              }}
            >
              <Gamepad2Icon />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>My Games</Text>
            </TouchableOpacity>

            <View
              style={{
                borderBottomColor: "lightgrey",
                borderBottomWidth: 1,
                width: "100%",
                marginBottom: 10,
              }}
            ></View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: 10,
                marginBottom: 10,
                gap: 5,
              }}
            >
              <User2 />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>
                Invite Gamers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginBottom: 10,
                padding: 10,
                gap: 5,
              }}
            >
              <Gamepad2 />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>
                Find Games
              </Text>
            </TouchableOpacity>

            {userData.length > 0 && userData[0].StatusRole != "player" && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  gap: 5,
                }}
              >
                <Gamepad2 />
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Find Players
                </Text>
              </TouchableOpacity>
            )}

            {userData.length > 0 && userData[0].StatusRole == "gamehost" && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  gap: 5,
                }}
              >
                <User2 />
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Find Player-for-hire
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                borderBottomColor: "lightgrey",
                borderBottomWidth: 1,
                width: "100%",
                marginBottom: 10,
              }}
            ></View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: 10,
                gap: 5,
                marginBottom: 10,
              }}
            >
              <Settings />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>
                Account Settings
              </Text>
            </TouchableOpacity>

            <View
              style={{
                borderBottomColor: "lightgrey",
                borderBottomWidth: 1,
                width: "100%",
                marginBottom: 10,
              }}
            ></View>

            <TouchableOpacity
              onPress={async () => {
                Cookie.clearAll();
                setUserData([]);
                setIsAuthenticated("");
                await AsyncStorage.clear();
                setIsOpen(false);
              }}
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: 10,
                gap: 5,
                marginBottom: 10,
              }}
            >
              <LogOut />
              <Text style={{ fontSize: 20, fontWeight: "400" }}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
      {userData.length > 0 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            position: "fixed",
            width: "100%",
            bottom: 0,
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
            padding: 10,
            paddingHorizontal: 30,
            paddingBottom: 30,
            backgroundColor: "white",
            zIndex: 50,
          }}
        >
          <TouchableOpacity>
            <MessageCircleMore size={30} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Compass size={30} />
          </TouchableOpacity>
          <TouchableOpacity>
            <PlusSquare size={30} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Gamepad2Icon size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (userData.length == 0) return;

              router.push(`Profile/user?username=${userData[0].UserName}`);
            }}
          >
            <User size={30} />
          </TouchableOpacity>
        </View>
      )}
    </AuthApi.Provider>
  );
}
