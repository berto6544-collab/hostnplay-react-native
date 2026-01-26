import React, { useContext, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Cookie from "@/Util/Cookie";
import { X } from "lucide-react-native";
import AuthApi from "../../../components/AuthApi";

export default function SidebarProfile({
  dataSource,
  username,
  followData,
  setFollowData,
}) {
  const Auth = useContext(AuthApi);
  const [index] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!dataSource?.length) return null;
  const user = dataSource[index];

  const handleFollow = async () => {
    const token = await Cookie.get("SCOM");
    if (!token) return;

    setFollowData(followData === 0 ? 1 : 0);

    fetch(
      `https://hostnplay.com/api/followers?followerid=${user.postId}&userid=${user.MyuserId}`,
      {
        method: "GET",
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: user.profileImg }} style={styles.avatar} />
        {user.OnlineData === "1" && <View style={styles.onlineDot} />}
      </View>

      {/* Name */}
      <Text style={styles.name}>{user.Name}</Text>
      <Text style={styles.username}>@{user.UserName}</Text>

      {/* Status */}
      {!!user.Status && <Text style={styles.status}>{user.Status}</Text>}

      {/* Actions */}
      {user.MyuserId !== user.OtheruserId && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFollow}>
            <Text style={styles.btnText}>
              {followData === 0 ? "Friend" : "Unfriend"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              Linking.openURL(`https://hostnplay.com/message/@${user.UserName}`)
            }
          >
            <Text style={styles.btnText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <Stat label="Games" value={user.GamesCount} />
        <Stat label="Friends" value={user.followerCount} />
        <Stat label="Friended" value={user.followingCount} />
      </View>

      {/* About */}
      {!!user.about && <Text style={styles.about}>{user.about}</Text>}

      {/* Add Link */}
      {user.MyuserId === user.OtheruserId && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => setShowLinkModal(true)}
        >
          <Text style={styles.btnText}>Add Link</Text>
        </TouchableOpacity>
      )}

      <AddLinkModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
      />
    </ScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontWeight: "bold" }}>{label}</Text>
      <Text style={{ color: "grey" }}>{value}</Text>
    </View>
  );
}

function AddLinkModal({ visible, onClose }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.modalTitle}>Add Link</Text>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
            >
              <X size={30} color={"black"} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={"gray"}
            style={styles.input}
          />

          <TextInput
            placeholder="URL"
            value={url}
            placeholderTextColor={"gray"}
            onChangeText={setUrl}
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  avatarWrapper: { alignItems: "center", marginTop: 40 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  onlineDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22d822",
  },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  username: { color: "grey", textAlign: "center" },
  status: { marginTop: 5, fontWeight: "bold", textAlign: "center" },
  actions: { flexDirection: "row", gap: 10, marginTop: 15 },
  primaryBtn: {
    backgroundColor: "#ff5a04",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryBtn: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "white", fontWeight: "bold" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  about: { textAlign: "center", color: "grey", marginBottom: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "black" },
  input: {
    backgroundColor: "#F2F2F2",
    color: "black",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
});
