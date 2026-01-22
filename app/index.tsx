import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [dataSource, setDataSource] = useState<any[]>([]);
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
      {dataSource.map((p, i) => {
        return (
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
                  <Text style={{ fontSize: 20, fontWeight: "700" }}>FREE</Text>
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
    paddingVertical: 40,
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
