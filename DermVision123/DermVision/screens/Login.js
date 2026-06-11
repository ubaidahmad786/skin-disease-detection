import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { firebase_auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const auth = firebase_auth;

  const signIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Tabs");
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        alert("Invalid email or password. Please check your credentials or Sign Up if you don't have an account.");
      } else {
        alert("SignIn failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.topRightArea}>
            <Text style={styles.topRightText}>Diagnosis at{"\n"}your Fingertips</Text>
            {/* Using a text emoji or placeholder for the small icon shown in screenshot */}
            <Text style={styles.topRightIcon}>📋</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.greeting}>Hi !{"\n"}Welcome to{"\n"}DermVision</Text>
            <Text style={styles.subtitle}>Please enter details</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                inputMode="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#000" />
              </Pressable>
            </View>

            <View style={styles.optionsRow}>
              <Pressable style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </Pressable>
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && styles.buttonPressed,
                loading && styles.disabledBtn,
              ]}
              onPress={signIn}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>
                {loading ? "Signing In..." : "Log In"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account ? </Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4E9",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  topRightArea: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  topRightText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E323F",
    textAlign: "right",
    marginRight: 8,
  },
  topRightIcon: {
    fontSize: 24,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 38,
    fontWeight: "600",
    color: "#2E323F",
    marginBottom: 20,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    paddingRight: 40, // space for the eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    bottom: 10,
    padding: 5,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2E323F",
    borderColor: "#2E323F",
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  forgotPasswordText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  loginBtn: {
    backgroundColor: "#2E323F",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabledBtn: {
    backgroundColor: "#94A3B8",
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
  signUpLink: {
    fontSize: 14,
    color: "#000",
    fontWeight: "700",
  },
});
