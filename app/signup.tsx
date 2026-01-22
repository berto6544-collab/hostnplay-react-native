import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataSet, setData] = useState("");
  const [isLoginin, setisLoginin] = useState(false);

  const handleOnClick = async () => {
    if (!email || !password) return;

    setisLoginin(true);
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_SITE + "/api/autth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();
      console.log(data);

      if (data?.Error) {
        setData(data.Error);
        setisLoginin(false);
      } else {
        const user = data.userAuth[0];

        await AsyncStorage.setItem("userId", String(user.userId));
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("SCOM", data.Token);
        await AsyncStorage.setItem("SCOM_", "1");
        await AsyncStorage.setItem("theme", "dark");

        //Auth.setUserData(data.userAuth);
        //Auth.setAuth(data.Token);

        if (route.params?.from) {
          navigation.replace(route.params.from);
        } else {
          navigation.replace("Home");
        }
      }
    } catch (err) {
      console.error(err);
      setData("Something went wrong. Please try again.");
      setisLoginin(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={{
          uri: "https://hostnplay.com/assets/img/controllerbackgrounder.webp",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.container}>
          <Text style={styles.title}>Sign into hostnplay</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: "#2a2f32",
                color: "#fff",
              },
            ]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: "#2a2f32",
                color: "#fff",
              },
            ]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleOnClick}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text style={styles.forgot}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleOnClick}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          {dataSet ? <Text style={styles.error}>{dataSet}</Text> : null}

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Signup", {
                  from: route.params?.from || "Home",
                });
              }}
            >
              <Text style={styles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </View>

          {isLoginin && (
            <ActivityIndicator
              size="large"
              color="#ff5b05"
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "rgba(40, 45, 47, 0.85)",
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 16,
  },
  forgot: {
    color: "#ff5b05",
    marginBottom: 20,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#ff5b05",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 12,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#ccc",
  },
  signupLink: {
    color: "#fff",
    fontWeight: "700",
  },
});
