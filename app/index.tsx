import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [search, setSearch] = useState<any>("");
  React.useEffect(() => {
    const fetchingData = async () => {
      const data = await fetch(`https://hostnplay.com/api/eventData?start=0`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      if (data.length == 0) return;
      setDataSource(data);
    };

    fetchingData();
  });

  return (
    <ScrollView contentOffset={{ x: 0, y: 10 }} style={styles.view}>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          padding: 10,
          gap: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 25, fontWeight: "700" }}>Find Games</Text>
          <Text>Discover the perfect game that fits your schedule!</Text>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            gap: 10,
          }}
        >
          <TextInput
            value={search}
            placeholder="Search by title or platform"
            placeholderTextColor={"lightgray"}
            style={{
              padding: 10,
              width: "80%",
              borderColor: "gray",
              borderWidth: 1,
              color: "black",
              borderRadius: 7,
            }}
            onChange={(e) => setSearch(e.target?.value)}
          />
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              padding: 10,
              borderRadius: 5,
              backgroundColor: "orange",
            }}
          >
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 4,
          }}
        >
          <Text>Filter</Text>
        </TouchableOpacity>
      </View>
      {dataSource.map((p, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              router.push(`Game/title/?uniqId=${p.uniqTitle}`);
            }}
          >
            <View style={styles.card}>
              <View style={{ position: "relative", overflow: "hidden" }}>
                <Text
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    borderRadius: 30,
                    padding: 10,
                    paddingHorizontal: 20,
                    zIndex: 5,
                    backgroundColor: " rgba(0, 0, 0, 0.5)",
                    color: "white",
                  }}
                >
                  {p.SpotsLeft == "0 spots left" ? "Full" : p.SpotsLeft}
                </Text>
                <Image src={p.Image} style={styles.cardImage}></Image>
              </View>
              <View style={styles.insideCard}>
                <Text style={styles.cardTitle}>{p.Title}</Text>
                {p.GameType == "" && (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Per session:</Text>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      FREE
                    </Text>
                  </View>
                )}

                {p.GameType == "paid" && (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Per session:</Text>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {p.Amount}
                    </Text>
                  </View>
                )}

                {p.GameType == "sub" && (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Sub-Games:</Text>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {p.SubAmount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      ;
      {/*<Link style={styles.navButton} href={"login"}>
        Login
      </Link>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 10,
    paddingVertical: 20,
  },

  insideCard: {
    width: "100%",
    padding: 20,
    paddingTop: 5,
    gap: 10,
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
  },

  card: {
    width: "100%",
    borderRadius: 30,
    position: "relative",
    backgroundColor: "white",
    overflow: "hidden",
    marginBottom: 20,
  },
  cardImage: {
    width: "100%",
    height: 250,
    objectFit: "cover",
  },
  cardTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "700",
  },

  navButton: {
    backgroundColor: "coral",
    padding: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});
