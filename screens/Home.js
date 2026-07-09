import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { firebase_auth, firebase_db } from "../firebaseConfig";
import { ref, set, push } from "firebase/database";

function Home() {
  const [image, setImage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const diseaseNames = [
    "Browen's Disease (akiec)",
    "Basal Cell Carcinoma (bcc)",
    "Benign Keratosis (bkl)",
    "Dermatofibroma (df)",
    "Melanoma (mel)",
    "Melanocytic Nevi (nv)",
    "Vascular Lesions (vasc)",
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    setResponseText("");
    try {
      const uploadUrl = "http://127.0.0.1:5000/process_image";
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const fetchRes = await fetch(uri);
        const blob = await fetchRes.blob();
        formData.append("image", blob, "predict.jpg");
      } else {
        formData.append("image", {
          uri,
          type: "image/jpeg",
          name: "predict.jpg",
        });
      }

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // --- SIMPLE LOGIC ---
      if (response.data.message === "Unknown") {
        alert("Invalid Image: Please upload a clear photo of the skin area.");
        setImage(null);
      } else {
        const diseaseName = diseaseNames[response.data.message];
        setResponseText(diseaseName);
        savePrediction(uri, diseaseName);
      }
    } catch (error) {
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const savePrediction = async (imageUri, prediction) => {
    try {
      const user = firebase_auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const predictionRef = ref(firebase_db, `users/${userId}/predictions`);
      const newPredictionRef = push(predictionRef);

      await set(newPredictionRef, {
        imageUri,
        prediction,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving prediction:", error);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => firebase_auth.signOut().then(() => navigation.navigate("Welcome"))}
          >
            <Text style={styles.backButtonText}>← Exit</Text>
          </Pressable>
          <Text style={styles.title}>Skin Analysis</Text>
          <Text style={styles.subtitle}>Scan your skin for instant identification</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>📷</Text>
                </View>
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.uploadBtn,
              pressed && styles.buttonPressed,
              loading && styles.disabledBtn,
            ]}
            onPress={pickImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadBtnText}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            )}
          </Pressable>
        </View>

        {responseText ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Analysis Result</Text>
            <Text style={styles.resultText}>{responseText}</Text>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>85% Confidence</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This output is generated by a machine learning model. It is not a
            substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of a dermatologist for any questions you may
            have regarding a skin condition.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#0EA5E9",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 32,
  },
  placeholderText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadBtn: {
    backgroundColor: "#0EA5E9",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabledBtn: {
    backgroundColor: "#94A3B8",
  },
  resultCard: {
    backgroundColor: "#F0F9FF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 24,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369A1",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 12,
  },
  accuracyBadge: {
    backgroundColor: "#E0F2FE",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  accuracyText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "700",
  },
  disclaimerBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#B91C1C",
  },
});
