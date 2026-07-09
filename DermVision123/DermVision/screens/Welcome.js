import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Welcome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/welcome_hero.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection}>
          <Text style={styles.title}>
            Diagnose your skin{"\n"}in seconds.
          </Text>
          
          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [
              styles.getStartedBtn,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.btnText}>GET STARTED</Text>
            <View style={styles.iconCircle}>
              <Text style={styles.iconArrow}>›</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4E9", // beige color from screenshot
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // Space between image and text at bottom
    paddingHorizontal: 30,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.08,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.45,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    width: "100%",
    alignItems: "flex-start", // Left align text
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E323F",
    lineHeight: 40,
    marginBottom: 20,
  },
  divider: {
    height: 2,
    backgroundColor: "#2E323F",
    width: "100%",
    marginBottom: 20,
  },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  btnText: {
    color: "#2E323F",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginRight: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FBA100", // Orange arrow circle
    justifyContent: "center",
    alignItems: "center",
  },
  iconArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20,
    marginLeft: 2, // Slight center offset
  },
});
