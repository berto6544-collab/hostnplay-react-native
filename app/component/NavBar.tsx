import AuthApi from "@/components/AuthApi";
import { router } from "expo-router";
import { Bell, Form, LogIn, Menu } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function NavBarRight({ token, userData }) {
  const Auth = React.useContext(AuthApi);
  const [isOpen, setIsOpen] = React.useState(false);

  const isAuthenticated = token != "";

  if (isAuthenticated) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          gap: 5,
        }}
      >
        {userData.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              userData[0].Notify = 0;
              Auth.setUserData([...Auth.userData]);
              fetch("https://hostnplay.com/api/notificationsCount");
              router.push("/notification");
            }}
            style={{ padding: 5, position: "relative" }}
          >
            <Bell color={"black"} size={30} />
            {userData[0].Notify > 0 && (
              <Text
                style={{
                  padding: 2,
                  paddingHorizontal: 6,
                  backgroundColor: "red",
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  bottom: 0,
                  right: 2,
                  fontSize: 12,
                  alignItems: "center",
                  borderRadius: "100%",
                }}
              >
                {userData[0].Notify}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/login");
          }}
        >
          <LogIn size={30} color={"black"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Menu color={"black"} size={30} />
        </TouchableOpacity>

        {isOpen && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "lightgrey",
              alignItems: "flex-start",
              position: "absolute",
              padding: 10,
              borderRadius: 10,
              top: 60,
              right: 10,
              zIndex: 20,
            }}
          >
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Form color={"black"} />
              <Text>Signup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export function NavBarMiddle() {
  const Auth = React.useContext(AuthApi);
}

export function NavBarLeft() {
  const Auth = React.useContext(AuthApi);
}
