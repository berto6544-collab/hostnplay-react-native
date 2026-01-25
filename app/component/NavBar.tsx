import AuthApi from "@/components/AuthApi";
import { router } from "expo-router";
import { Bell, Form, LogIn, Menu } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

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
        <TouchableOpacity style={{ padding: 10 }}>
          <Bell color={"black"} />
        </TouchableOpacity>
        {userData.length > 0 && (
          <TouchableOpacity style={{ padding: 10 }}>
            <Avatar.Image
              size={30}
              source={{ uri: userData[0].ProfileImage }}
            />
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
              width: "100%",
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
