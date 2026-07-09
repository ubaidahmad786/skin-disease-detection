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
            source={require("../assets/hero.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI-Powered Diagnosis</Text>
          </View>

          <Text style={styles.title}>
            Derm<Text style={styles.subtitle}>Vision</Text>
          </Text>

          <Text style={styles.description}>
            AI-powered skin cancer detection for everyone, everywhere.
            Get instant analysis with clinical-grade accuracy.
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.getStartedBtn,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.btnText}>Get Started</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.secondaryBtnText}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    width: "100%",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "#0EA5E9",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  getStartedBtn: {
    backgroundColor: "#0EA5E9",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryBtnText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "600",
  },
});
