import { useNavigation, useRoute } from "@react-navigation/native";
import { MoreVertical } from "lucide-react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthApi from "../../components/AuthApi";
import SidebarProfile from "./SidebarProfile/SidebardProfile";

function User(props) {
  const Auth = useContext(AuthApi);
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params;
  const [index, setIndex] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [followData, setFollowData] = useState(0);
  const [dataSourceLink, setDataSourceLink] = useState([]);
  const [showIconDialog, setShowIconDialog] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: username,
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity>
            <MoreVertical size={25} />
          </TouchableOpacity>
        </View>
      ),
    });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://hostnplay.com/api/GameHostDataUser?username=${username}&start=0`,
      );
      const responseJSON = await response.json();

      if (responseJSON.length > 0) {
        setDataSource(responseJSON);
        setDataSourceLink(responseJSON[0].LinksArray);
        setFollowData(parseInt(responseJSON[0].followData));

        // Check URL param manually if needed
        if (route.params?.type === "customicon") {
          setShowIconDialog(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (dataSource.length === 0) {
    return <View />;
  }

  const renderSection = () => {
    switch (index) {
      case 0:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25 }}>No Games Available</Text>
          </View>
        );
      case 1:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25 }}>No Blog Available</Text>
          </View>
        );
      case 2:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25 }}>No Posts Available</Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25 }}>No Games Available</Text>
          </View>
        );
    }
  };

  return (
    <ScrollView
      ref={containerRef}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <SidebarProfile
        dataSource={dataSource}
        setFollowData={setFollowData}
        followData={followData}
        setDataSourceLink={setDataSourceLink}
        dataSourceLink={dataSourceLink}
        username={username}
        setDataSource={setDataSource}
        userData={props.userData}
      />

      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.tabContainer,
            {
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            },
          ]}
        >
          {["Games", "Blogs", "Post"].map((tab, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setIndex(i)}
              disabled={index === i}
              style={[styles.tabButton, index === i && styles.activeTab]}
            >
              <Text style={{ color: index === i ? "orange" : "black" }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ width: "100%", marginTop: 10 }}>{renderSection()}</View>
      </View>
    </ScrollView>
  );
}

// --- OpenUrl Component Conversion ---
export function OpenUrl(
  urls,
  isExpanded,
  setIsExpanded,
  setDataSourceLink,
  userid,
  otheruserid,
) {
  if (!urls || urls.length === 0) return null;

  const handleRemove = async (id, index) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const res = await fetch(process.env.REACT_APP_API + "/RemoveLink", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.length > 0) {
        urls.splice(index, 1);
        setDataSourceLink([...urls]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderLinkItem = (linkObj, i) => {
    let icon = { uri: "https://static.thenounproject.com/png/4481649-200.png" }; // default icon
    if (linkObj.Link.includes("twitter.com"))
      icon = {
        uri: "https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png",
      };
    else if (linkObj.Link.includes("youtube.com"))
      icon = {
        uri: "https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png",
      };
    else if (linkObj.Link.includes("instagram.com"))
      icon = { uri: "https://cdn-icons-png.flaticon.com/512/3621/3621435.png" };
    else if (linkObj.Link.includes("tiktok.com"))
      icon = {
        uri: "https://w7.pngwing.com/pngs/814/840/png-transparent-tiktok-tiktok-logo-tiktok-icon-thumbnail.png",
      };
    else if (linkObj.Link.includes("facebook.com"))
      icon = { uri: "https://cdn-icons-png.flaticon.com/512/124/124010.png" };
    // add more mappings as needed

    return (
      <TouchableOpacity
        key={i}
        style={styles.linkItem}
        onPress={() => Linking.openURL(linkObj.Link)}
      >
        <Image source={icon} style={styles.linkIcon} />
        <Text style={{ flex: 1 }}>{linkObj.LinkText}</Text>

        {otheruserid === userid ? (
          <TouchableOpacity onPress={() => handleRemove(linkObj.Id, i)}>
            <Text style={{ color: "red", marginLeft: 10 }}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ marginLeft: 10 }}>➡</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
      {isExpanded ? urls.map(renderLinkItem) : renderLinkItem(urls[0], 0)}
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={{ color: "blue", marginTop: 5 }}>
          {isExpanded ? "Show Less ▲" : "Show More ▼"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: "orange",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  linkIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
    resizeMode: "contain",
  },
});

export default User;
