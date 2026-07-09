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
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { firebase_auth, firebase_db } from "../firebaseConfig";
import { ref, set, push, onValue } from "firebase/database";

function Home({ navigation }) {
  const [image, setImage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = firebase_auth.currentUser;
    if (user) {
      const userRef = ref(firebase_db, "users/" + user.uid);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.name) {
          setUserName(data.name);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const diseaseNames = [
    "Akiec", // Updated to match screenshot shortname
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

      if (response.data.message === "Unknown") {
        alert("Invalid Image: Please upload a clear photo of the skin area.");
        setImage(null);
      } else {
        const diseaseName = diseaseNames[response.data.message] || response.data.message;
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
      await push(predictionRef, {
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
      <View style={styles.header}>
        <Text style={styles.greetingTitle}>Hi, {userName}</Text>
        <Pressable 
          style={styles.avatarCircle}
          onPress={() => {
            firebase_auth.signOut()
              .then(() => navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              }))
              .catch(error => alert("Error signing out: " + error.message));
          }}
        >
          <Text style={styles.avatarPlaceholder}>👤</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {image && (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.uploadSection}>
          <Pressable
            style={({ pressed }) => [
              styles.blueBtn,
              pressed && styles.buttonPressed,
              loading && styles.disabledBtn,
            ]}
            onPress={pickImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.blueBtnText}>UPLOAD IMAGE</Text>
            )}
          </Pressable>

          {responseText ? (
            <View style={styles.predictionBoxActive}>
              <Text style={styles.predictionTextActive}>Prediction : {responseText}</Text>
            </View>
          ) : (
            <Text style={styles.predictionText}>Prediction : -</Text>
          )}
        </View>

      </ScrollView>

      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          This output is generated by a machine learning model with an 85% accuracy rate.{"\n"}
          For a definitive diagnosis, it is recommended to consult a dermatologist.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F7F4E9",
  },
  header: {
    backgroundColor: "#00E5FF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E323F",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FF5252", // Similar to screenshot
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    fontSize: 24,
    color: "#FFF",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  imageWrapper: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: "#4CAF50",
    backgroundColor: "#FFF",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadSection: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  blueBtn: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  disabledBtn: {
    backgroundColor: "#94A3B8",
  },
  blueBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E323F",
  },
  predictionBoxActive: {
    backgroundColor: "#FFCDD2", // Reddish background
    borderWidth: 2,
    borderColor: "#D32F2F", // Red border
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Similar to screenshot red pop-out
  },
  predictionTextActive: {
    fontSize: 18,
    fontWeight: "800",
    color: "#B71C1C", // Dark Red text
  },
  disclaimerContainer: {
    backgroundColor: "#000000",
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: "#D32F2F",
    marginHorizontal: -4, // Ensure edge to edge in safeareaview
  },
  disclaimerText: {
    color: "#F44336", // Red text
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 18,
  },
});
