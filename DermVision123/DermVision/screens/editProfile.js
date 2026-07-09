import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { firebase_auth, firebase_db } from "../firebaseConfig";
import { ref, update } from "firebase/database";
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleUpdate = async () => {
    const userId = firebase_auth.currentUser.uid;
    const userRef = ref(firebase_db, `users/${userId}`);

    try {
      await update(userRef, { name, mobile });
      // Optionally, update Firebase Auth profile as well
      // await updateProfile(firebase_auth.currentUser, { displayName: name });
      navigation.navigate("Profile"); // Redirect to profile page on success
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    width: '100%',
    backgroundColor: 'beige',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'darkgreen',
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});
