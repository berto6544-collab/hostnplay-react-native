import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AuthApi from "../components/AuthApi";

let theme = "dark";

function Notification() {
  const Auth = useContext(AuthApi);
  const navigation = useNavigation();

  const [dataSource, setDataSource] = useState([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [themeMode, setThemeMode] = useState("dark");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://hostnplay.com/api/notificationData?start=${start}`,
      );
      const json = await res.json();

      if (json.length > 0) {
        setDataSource(start === 0 ? json : [...dataSource, ...json]);
        setStart(start + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <NotificationData posts={item} Auth={Auth} navigation={navigation} />
  );

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[styles.headerText]}>Notifications</Text>
      </View>

      <FlatList
        data={dataSource}
        keyExtractor={(item) => item.postId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={() => {
          if (hasMore) fetchData();
        }}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={"black"}
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
      />
    </View>
  );
}

const NotificationData = ({ posts, Auth, navigation }) => {
  const theme = Auth.theme || "dark";
  const styles = getStyles(theme);

  const go = (route: string) => {
    if (route.startsWith("http")) {
      // external web
      Linking.openURL(route);
    } else {
      navigation.navigate(route);
    }
  };

  const CardWrapper = ({ children, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      {children}
    </TouchableOpacity>
  );

  const Header = ({ img, name }) => (
    <View style={styles.headerRow}>
      <Image source={{ uri: img }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );

  const ImageRow = ({ img, children }) => (
    <View style={styles.imageRow}>
      <Image source={{ uri: img }} style={styles.thumbnail} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );

  if (posts.Type === 1) {
    const token = atob(posts.Extra[0].OrderData[0].token);
    return (
      <CardWrapper
        onPress={() => go(`https://hostnplay.com/ordered/game/${token}`)}
      >
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <ImageRow img={posts.Extra[0].OrderData[0].Image}>
          <Text style={styles.body}>{posts.PostStatus}</Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 2) {
    return (
      <View style={styles.card}>
        <Header img={posts.ProfileImg} name={posts.SenderName} />
        <Text style={styles.body}>{posts.PostStatus}</Text>
      </View>
    );
  }

  if (posts.Type === 3) {
    return (
      <CardWrapper onPress={() => navigation.navigate("CreateGame")}>
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.body}>
            Your game "{posts.Extra[0].Title}" has been {posts.Extra[0].Status}{" "}
            on <Text style={{ fontWeight: "bold" }}>{posts.NotifyDate}</Text>
          </Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 4) {
    return (
      <CardWrapper
        onPress={() =>
          navigation.navigate("Message", {
            username: posts.SenderUsername,
          })
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderName} />
        <Text style={styles.body}>{posts.PostStatus}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 5) {
    const token = atob(posts.Extra[0].token);
    return (
      <CardWrapper
        onPress={() => go(`https://hostnplay.com/ordered/game/${token}`)}
      >
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.body}>
            You made a payment on{" "}
            <Text style={{ fontWeight: "bold" }}>{posts.NotifyDate}</Text> to{" "}
            <Text style={{ fontWeight: "bold" }}>{posts.SenderName}</Text> for "
            {posts.Extra[0].Title}" starting {posts.Extra[0].Date}
          </Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 6) {
    return (
      <CardWrapper
        onPress={() =>
          navigation.navigate("ReviewBoard", {
            username: posts.SenderUsername,
            token: posts.Extra[0].Token,
          })
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderName} />
        <Text style={styles.body}>{posts.SenderName} has made a review</Text>
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 7) {
    return (
      <CardWrapper onPress={() => go("https://hostnplay.com/admin.php")}>
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 8) {
    return (
      <CardWrapper
        onPress={() =>
          go(`https://hostnplay.com/review/@${posts.Extra[0].UserName}`)
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.title}>{posts.Extra[0].Title}</Text>
          <Text style={styles.body}>{posts.Extra[0].Body}</Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 10) {
    return (
      <View style={styles.card}>
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <ImageRow img={posts.Extra[0].OrderData[0].Image}>
          <Text style={styles.body}>{posts.Extra[0].OrderData[0].Body}</Text>
        </ImageRow>
      </View>
    );
  }

  if (posts.Type === 11) {
    return (
      <CardWrapper onPress={() => navigation.navigate("CreateGame")}>
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 12) {
    return (
      <CardWrapper
        onPress={() =>
          navigation.navigate("Invoice", {
            token: posts.Extra[0].invoiceToken,
          })
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 15) {
    return (
      <CardWrapper
        onPress={() =>
          navigation.navigate("OrderedGame", {
            token: posts.Extra[0].Token,
          })
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 19) {
    return (
      <CardWrapper
        onPress={() =>
          navigation.navigate("GameMessage", {
            id: posts.Extra[0].uniqidMessage,
          })
        }
      >
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.body}>{posts.Extra[0].Message}</Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 22) {
    return (
      <View style={styles.card}>
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <Text style={styles.body}>{posts.Extra[0].Message}</Text>
      </View>
    );
  }

  if (posts.Type === 23) {
    const token = atob(posts.Extra[0].OrderData[0].token);
    return (
      <CardWrapper
        onPress={() => go(`https://hostnplay.com/ordered/game/${token}`)}
      >
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <ImageRow img={posts.Extra[0].OrderData[0].Image}>
          <Text style={styles.body}>{posts.PostStatus}</Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 24) {
    const token = atob(posts.Extra[0].token);
    return (
      <CardWrapper
        onPress={() => go(`https://hostnplay.com/ordered/game/${token}`)}
      >
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.body}>
            {posts.ReceiverName} made a payment on{" "}
            <Text style={{ fontWeight: "bold" }}>{posts.NotifyDate}</Text> for "
            {posts.Extra[0].Title}" starting {posts.Extra[0].Date}
          </Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  if (posts.Type === 67 || posts.Type === 68 || posts.Type === 70) {
    return (
      <CardWrapper
        onPress={() =>
          go(`https://hostnplay.com/game/request/${posts.Extra[0].uniq}`)
        }
      >
        <Header img={posts.ReceiverProfileImg} name={posts.ReceiverName} />
        <Text style={styles.body}>{posts.Extra[0]?.Body}</Text>
      </CardWrapper>
    );
  }

  if (posts.Type === 80 || posts.Type === 81) {
    return (
      <CardWrapper onPress={() => go("https://hostnplay.com/upcoming-games")}>
        <Header img={posts.ProfileImg} name={posts.SenderUsername} />
        <ImageRow img={posts.Extra[0].Image}>
          <Text style={styles.title}>{posts.Extra[0].Title}</Text>
          <Text style={styles.body}>
            {posts.Extra[0].Body}{" "}
            {posts.Type === 81 && (
              <Text style={{ fontWeight: "bold" }}>
                {posts.Extra[0].GameCode}
              </Text>
            )}
          </Text>
        </ImageRow>
      </CardWrapper>
    );
  }

  return null;
};

const getStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    name: {
      fontWeight: "bold",
      color: "black",
    },
    body: {
      color: "black",
    },
    title: {
      fontWeight: "bold",
      color: "black",
      marginBottom: 4,
    },
    imageRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 10,
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 10,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    paddingVertical: 16,
    position: "relative",
    zIndex: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default Notification;
