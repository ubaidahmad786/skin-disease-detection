// ChangePassword.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { firebase_auth } from "../firebaseConfig";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    const user = firebase_auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Password updated successfully");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
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
