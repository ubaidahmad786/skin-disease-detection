import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { fetchUserData } from '../userData';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function Header() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useFocusEffect to fetch user data when the component gains focus
  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const data = await fetchUserData();
          setUserData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      getUserData();
    }, [])
  );

  if (loading) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.topbox}>
      <View style={styles.flexbox}>
        <View>
          <Text style={styles.usergreeting}>Hi, {userData.name}</Text>
        </View>
        <Image
          source={require("../assets/static/profile.png")}
          style={styles.userimg}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topbox: {
    backgroundColor: "#00e9f1",
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  flexbox: {
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  usergreeting: {
    fontSize: 30,
    fontWeight: "bold",
  },
  userimg: {
    aspectRatio: 1,
    width: 70,
  },
});
