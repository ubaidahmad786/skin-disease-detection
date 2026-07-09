import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState, useCallback } from "react";
import { fetchUserData } from "../userData";
import * as ImagePicker from "expo-image-picker";
import {
  firebase_auth,
  firebase_db,
  firebase_storage,
} from "../firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { ref as dbRef, update } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const refreshUserData = async () => {
        try {
          const data = await fetchUserData();
          setUserData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      refreshUserData();
    }, [])
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const userId = firebase_auth.currentUser.uid;
      const response = await fetch(uri);
      const blob = await response.blob();
      const sRef = storageRef(firebase_storage, `profile_pictures/${userId}`);
      const snapshot = await uploadBytes(sRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateProfile(firebase_auth.currentUser, {
        photoURL: downloadURL,
      });

      const userRef = dbRef(firebase_db, `users/${userId}`);
      await update(userRef, { photoURL: downloadURL });

      setUserData({ ...userData, photoURL: downloadURL });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebase_auth.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <Pressable onPress={pickImage} style={styles.avatarContainer}>
            {uploading ? (
              <ActivityIndicator color="#0EA5E9" />
            ) : (
              <Image
                source={
                  userData.photoURL
                    ? { uri: userData.photoURL }
                    : require("../assets/static/profile.png")
                }
                style={styles.avatar}
              />
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✎</Text>
            </View>
          </Pressable>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData.mobile || "Not set"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Pressable
            style={styles.menuItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>chevron-right</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.menuItemArrow}>chevron-right</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={styles.menuItem}
            onPress={() => console.log("About")}
          >
            <Text style={styles.menuItemText}>About DermVision</Text>
            <Text style={styles.menuItemArrow}>chevron-right</Text>
          </Pressable>
        </View>

        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0EA5E9",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#64748B",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
  },
  menuItemArrow: {
    color: "#94A3B8",
    fontSize: 14,
  },
  signOutBtn: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  signOutBtnText: {
    color: "#991B1B",
    fontSize: 16,
    fontWeight: "700",
  },
});
