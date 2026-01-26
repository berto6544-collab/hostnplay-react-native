import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import AuthApi from "../../components/AuthApi";
import CustomSelect from "./component/CustomSelect";

export default function Game() {
  const { uniqId, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const date1 = moment().unix();
  const Auth = useContext(AuthApi);

  const [index, setIndex] = useState(0);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataSourceReview, setDataSourceReview] = useState([]);
  const [start, setStart] = useState(0);
  const [show, setShow] = useState(false);
  const [Id, setId] = useState(0);
  const [spot, setSpot] = useState("");
  const [spotCount, setSpotCount] = useState(0);
  const [spotFilled, setSpotFilled] = useState("");
  const [schedule, setSched] = useState("");
  const [scheduleDate, setSchedDate] = useState("");
  const [isDateMore, setisDateMore] = useState(false);
  const [showBottomNavbar, setshowBottomNavbar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://hostnplay.com/api/unique-event?id=" + uniqId,
      );
      const responseJSON = await res.json();

      setDataSource(responseJSON);

      setSched(responseJSON[0].EventDate);
      setDataSourceReview(responseJSON[0].ReviewData);
      setId(responseJSON[0].EventDateId);
      setSpot(responseJSON[0].SpotsAvailable);
      setSpotFilled(responseJSON[0].Spots);
      setSpotCount(responseJSON[0].DataDate[0].SpotCount);

      const result = moment(responseJSON[0].EventDates)
        .subtract(1, "day")
        .unix();

      setSchedDate(result);
      setisDateMore(date1 <= result);
      navigation.setOptions({ title: responseJSON[0].Title });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check this out: https://hostnplay.com/g/${uniqId}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://hostnplay.com/g/${uniqId}`);
  };

  const handleBookPress = () => {
    if (dataSource.length == 0) return;
    //const item = dataSource[index];

    if (dataSource[index].GameType !== "sub") {
      if (Auth?.isAuthenticated) {
        //router.push(`/Game/Payment?id=${Id}`);
      } else {
        router.push(`/login`);
      }
    } else {
      if (Auth?.isAuthenticated) {
        if (dataSource[index].GameData === 0) {
          //router.push("/profile/ProfileSubscription", {username: item.UserName,});
        } else {
          // router.push(`/Game/payment?id=${Id}&uniqId=${uniqId}` });
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!dataSource.length) {
    return null;
  }

  const item = dataSource[index];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: item.Image }} style={styles.headerImage} />
        <View style={styles.overlay} />

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {item.Title.replaceAll("[nl]", "\n")}
          </Text>

          {item.about !== "" && (
            <Text style={styles.aboutText}>
              {item.about.replaceAll("[nl]", "\n")}
            </Text>
          )}

          {(item.PlayersBring !== "" ||
            item.Bring !== "" ||
            item.Content.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Further details</Text>

              {item.PlayersBring !== "" && (
                <View style={styles.listSection}>
                  <Text
                    style={(styles.bold, { color: "white", fontWeight: "700" })}
                  >
                    How to prepare
                  </Text>
                  {item.PlayersBring.split("[nl]").map((p, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {p}
                    </Text>
                  ))}
                </View>
              )}

              {item.Bring !== "" && (
                <View style={styles.listSection}>
                  <Text
                    style={(styles.bold, { color: "white", fontWeight: "700" })}
                  >
                    Rules for the session!
                  </Text>
                  {item.Bring.split("[nl]").map((p, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {p}
                    </Text>
                  ))}
                </View>
              )}

              {item.Content.length > 0 && (
                <View style={styles.listSection}>
                  <Text style={styles.bold}>Content warnings</Text>
                  {item.Content.map((p, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {p.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {(item.Combat.length > 0 ||
            item.RolePlay.length > 0 ||
            item.Puzzle.length > 0 ||
            item.Experience.length > 0) && (
            <View style={styles.section}>
              {item.Combat.length > 0 && (
                <Text>
                  <Text style={styles.bold}>Combat: </Text>
                  {item.Combat[0].name}
                </Text>
              )}
              {item.RolePlay.length > 0 && (
                <Text>
                  <Text style={styles.bold}>RolePlay: </Text>
                  {item.RolePlay[0].name}
                </Text>
              )}
              {item.Puzzle.length > 0 && (
                <Text>
                  <Text style={styles.bold}>Puzzle: </Text>
                  {item.Puzzle[0].name}
                </Text>
              )}
              {item.Experience.length > 0 && (
                <Text>
                  <Text style={styles.bold}>Experience: </Text>
                  {item.Experience[0].name}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.cardImageWrapper}>
          <Image source={{ uri: item.Image }} style={styles.cardImage} />
          <View style={styles.spotBadge}>
            <Text style={styles.spotText}>
              {spot > 0 ? `Only ${spot} spots left` : "No spots left"}
            </Text>
          </View>

          {item.review > 5 && (
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewText}>❤️ {item.review} Reviews</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle}>
          {item.Title.replaceAll("[nl]", "\n")}
        </Text>

        {/* PRICE */}
        <View style={styles.rowBetween}>
          <Text>Cost per player</Text>
          <Text style={styles.priceText}>
            {item.GameType === "paid"
              ? item.AmountTotal !== "0.00"
                ? item.Amount
                : "FREE"
              : item.GameType === ""
                ? item.AmountTotal !== "0.00" && item.GameType !== ""
                  ? item.Amount
                  : "FREE"
                : `$${item.SubAmount}`}
          </Text>
        </View>

        {/* DETAILS */}
        <View style={styles.detailsSection}>
          <View>
            <Text style={styles.bold}>Scheduled</Text>
            <Text>{schedule}</Text>
          </View>

          <View>
            <Text style={styles.bold}>Session period</Text>
            <Text>{item?.Hours} hours</Text>
          </View>

          <View>
            {
              <CustomSelect
                setId={setId}
                setSched={setSched}
                setSchedDate={setSchedDate}
                setSpot={setSpot}
                setSpotCount={setSpotCount}
                setSpotFilled={setSpotFilled}
                data={dataSource[0]}
                uniqId={uniqId}
              />
            }
          </View>
        </View>

        <View>
          <Text style={styles.bold}>Details</Text>
          <Text>Number of players: {spotFilled}</Text>
        </View>

        {/* ACTION BUTTON */}
        {spot > 0 && spotCount === 0 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBookPress}
          >
            <Text style={styles.primaryButtonText}>Book A Spot</Text>
          </TouchableOpacity>
        ) : spot >= 0 && spotCount > 0 && isDateMore ? (
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.primaryButtonText}>Fully Booked</Text>
          </View>
        )}

        {item.GameType === "paid" && (
          <Text style={styles.subText}>Book today and pay on the day.</Text>
        )}

        {item.GameType !== "paid" && item.GameType !== "" && (
          <Text style={styles.subText}>
            Subscribe to {dataSource[0].UserName} & play subscription games.
          </Text>
        )}
      </View>

      {/* HOST INFO */}
      <View style={styles.card}>
        <View style={styles.hostRow}>
          <Avatar.Image size={75} source={{ uri: item.profile }} />
          <View style={{ marginLeft: 10 }}>
            <View style={styles.nameRow}>
              <Text style={styles.hostName}>{item.Name}</Text>
              {item.Emote !== "" && (
                <Image source={{ uri: item.Emote }} style={styles.emote} />
              )}
            </View>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{item.UserName}</Text>
              {item.review > 0 && (
                <Text style={styles.rating}>⭐ {parseFloat(item.rating)}</Text>
              )}
            </View>
          </View>
        </View>

        {item.AboutMe !== "" && (
          <View style={styles.bioSection}>
            <Text style={styles.bold}>Bio</Text>
            <Text>{item.AboutMe.replaceAll("[nl]", "\n")}</Text>
          </View>
        )}

        <View style={styles.platforms}>
          {item.platform.map((p, i) => (
            <View key={i} style={styles.platformBadge}>
              <Text style={styles.platformText}>{p.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.profileActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              navigation.setOptions({ title: item.UserName });
              router.push(`Profile/user?username=${item.UserName}`);
            }}
          >
            <Text style={styles.secondaryButtonText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push(`Message/message?username=${item.UserName}`)
            }
          >
            <Text style={styles.secondaryButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SHARE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Share on socials</Text>

        <View style={styles.shareRow}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
            <Text style={styles.shareText}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => Linking.openURL(`https://hostnplay.com/g/${uniqId}`)}
          >
            <Text>Open</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerContainer: {
    width: "100%",
    height: 400,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  aboutText: {
    color: "white",
    marginTop: 10,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  bold: { fontWeight: "700" },
  listSection: { marginBottom: 15 },
  listItem: { color: "white", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardImageWrapper: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  spotBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  spotText: { color: "white", fontWeight: "bold" },
  reviewBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  reviewText: { color: "white" },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    alignItems: "center",
  },
  priceText: { fontSize: 22, fontWeight: "bold" },
  detailsSection: { marginVertical: 10 },
  primaryButton: {
    backgroundColor: "#ff5c05",
    padding: 14,
    borderRadius: 6,
    marginTop: 15,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "grey",
    padding: 14,
    borderRadius: 6,
    marginTop: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
    color: "gray",
  },

  hostRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostName: { fontSize: 18, fontWeight: "bold" },
  emote: { width: 30, height: 30, marginLeft: 5 },
  usernameRow: { flexDirection: "row", alignItems: "center" },
  username: { color: "gray", marginRight: 8 },
  rating: { color: "#faaf12" },
  bioSection: { marginTop: 10 },
  platforms: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  platformBadge: {
    backgroundColor: "rgb(250, 175, 18)",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  platformText: { color: "black", fontWeight: "500" },
  profileActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#ff5c05",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#ff5c05",
    fontWeight: "bold",
  },

  shareRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  shareButton: {
    backgroundColor: "lightgrey",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 50,
  },
  shareText: { fontWeight: "700" },
});
