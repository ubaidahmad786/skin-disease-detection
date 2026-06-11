import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from "react-native";
import ServiceCard from "../components/ServiceCard";
import { firebase_db, firebase_auth } from "../firebaseConfig";
import { ref, get, child, remove } from "firebase/database";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

function Services() {
  const navigation = useNavigation();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'SINGLE', id: ... } or { type: 'ALL' }

  useFocusEffect(
    useCallback(() => {
      const fetchPredictions = async () => {
        setLoading(true);
        try {
          const user = firebase_auth.currentUser;
          if (!user) return;

          const userId = user.uid;
          const predictionsRef = ref(firebase_db, `users/${userId}/predictions`);
          const snapshot = await get(child(predictionsRef, "/"));
          if (snapshot.exists()) {
            const data = snapshot.val();
            const predictionsList = Object.keys(data)
              .map((key) => ({
                id: key,
                ...data[key],
              }))
              .sort((a, b) => new Date(b.date) - new Date(a.date));
            setPredictions(predictionsList);
          } else {
            setPredictions([]);
          }
        } catch (error) {
          console.error("Error fetching prediction history:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPredictions();
    }, [])
  );

  const handleDeleteItem = (id) => {
    setDeleteTarget({ type: 'SINGLE', id });
  };

  const handleClearHistory = () => {
    if (predictions.length === 0) return;
    setDeleteTarget({ type: 'ALL' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const user = firebase_auth.currentUser;
      if (!user) return;

      if (deleteTarget.type === 'SINGLE') {
        const itemRef = ref(firebase_db, `users/${user.uid}/predictions/${deleteTarget.id}`);
        await remove(itemRef);
        setPredictions((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'ALL') {
        const predictionsRef = ref(firebase_db, `users/${user.uid}/predictions`);
        await remove(predictionsRef);
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>History</Text>
          <View style={{ flex: 1 }} />
          {predictions.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
              <Ionicons name="trash-bin" size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>Your previous skin analysis results</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.cardholder}>
          {predictions.length > 0 ? (
            predictions.map((prediction) => (
              <ServiceCard
                key={prediction.id}
                date={prediction.date}
                imageUri={prediction.imageUri}
                prediction={prediction.prediction}
                onDelete={() => handleDeleteItem(prediction.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>📋</Text>
              </View>
              <Text style={styles.noprediction}>No history found</Text>
              <Text style={styles.emptySubtext}>
                Run your first analysis to see results here.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={deleteTarget !== null}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>
              {deleteTarget?.type === 'ALL' ? 'Clear All History' : 'Delete Result'}
            </Text>
            <Text style={styles.modalText}>
              {deleteTarget?.type === 'ALL' 
                ? 'Are you sure you want to delete all your history? This action cannot be undone.'
                : 'Are you sure you want to delete this specific result?'}
            </Text>
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelDelete}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonDelete} onPress={confirmDelete}>
                <Text style={styles.modalButtonDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default Services;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F7F4E9",
  },
  header: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: "#F7F4E9",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
  },
  clearButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  cardholder: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  noprediction: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
    alignItems: "center",
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  modalButtonDelete: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    marginLeft: 8,
    alignItems: "center",
  },
  modalButtonDeleteText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
