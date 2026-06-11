import React, { useState } from "react";
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
import { firebase_auth, firebase_db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const signUp = async () => {
    if (!name || !email || !password || !mobile) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        firebase_auth,
        email,
        password
      );
      const userId = response.user.uid;
      await set(ref(firebase_db, "users/" + userId), {
        name,
        email,
        mobile,
      });
      navigation.navigate("Tabs");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered! Please go to the Login screen to sign in.");
      } else {
        alert("Registration failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← </Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.greeting}>Register to{"\n"}DermVision</Text>
            <Text style={styles.subtitle}>Please enter details</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#A0A0A0"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

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
                placeholder="Mobile"
                placeholderTextColor="#A0A0A0"
                value={mobile}
                onChangeText={(text) => setMobile(text)}
                inputMode="tel"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off" : "eye"} 
                  size={24} 
                  color="#4CAF50" 
                />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.signUpBtn,
                pressed && styles.buttonPressed,
                loading && styles.disabledBtn,
              ]}
              onPress={signUp}
              disabled={loading}
            >
              <Text style={styles.signUpBtnText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4E9",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 24,
    color: "#2E323F",
    fontWeight: "700",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  greeting: {
    fontSize: 32,
    fontWeight: "600",
    color: "#2E323F",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  form: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  signUpBtn: {
    backgroundColor: "#2E323F",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabledBtn: {
    backgroundColor: "#94A3B8",
  },
  signUpBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
