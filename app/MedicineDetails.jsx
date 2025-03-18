import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchMedicineData } from "./fetchMedicine";
import backgroundImage from "../assets/images/image.png"; // Adjust the path if needed

const MedicineDetails = () => {
  const { medicineId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [currentOwner, setCurrentOwner] = useState("");
  const [previousOwners, setPreviousOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!medicineId) return;
    const loadMedicineData = async () => {
      const data = await fetchMedicineData(medicineId);
      if (data) {
        setMedicineDetails(data.medicineData || []);
        setCurrentOwner(data.currentOwner || "Unknown");
        setPreviousOwners(data.previousOwners || []);
      }
      setLoading(false);
    };
    loadMedicineData();
  }, [medicineId]);

  const handleCopyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", "Address copied to clipboard.");
  };

  if (!medicineId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: No Medicine ID provided.</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" color="#1e3a8a" />;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* Back & Camera Buttons */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
            </TouchableOpacity>
          </View>

          {/* Main Header */}
          <Text style={styles.header}>Medicine Details</Text>

          {/* Medicine History */}
          <Text style={styles.subHeader}>Medicine History</Text>
          {medicineDetails.length > 0 ? (
            medicineDetails.map((record, index) => (
              <View key={index} style={styles.card}>
                {Object.entries(record).map(([key, value]) => (
                  <Text key={key} style={styles.recordText}>
                    <Text style={styles.bold}>
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </Text>{" "}
                    {typeof value === "string" && Date.parse(value)
                      ? new Date(value).toLocaleString()
                      : value}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No medicine history found.</Text>
          )}

          {/* Current Owner */}
          <Text style={styles.subHeader}>Current Owner</Text>
          <View style={styles.ownerContainer}>
            <Text style={styles.ownerText}>{currentOwner}</Text>
            <TouchableOpacity onPress={() => handleCopyToClipboard(currentOwner)}>
              <Ionicons name="copy" size={24} color="#1e3a8a" />
            </TouchableOpacity>
          </View>

          {/* Previous Owners */}
          {previousOwners.length > 0 && (
            <View>
              <Text style={styles.subHeader}>Previous Owners</Text>
              {previousOwners.map((owner, index) => (
                <TouchableOpacity key={index} onPress={() => handleCopyToClipboard(owner)}>
                  <Text style={styles.ownerText}>{owner}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Transparent white
    borderRadius: 10,
    margin: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e3a8a",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#374151",
  },
  bold: {
    fontWeight: "bold",
    color: "#111827",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 5,
    marginTop: 5,
    justifyContent: "space-between",
  },
  ownerText: {
    fontSize: 16,
    color: "#1f2937",
    flexShrink: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MedicineDetails;
