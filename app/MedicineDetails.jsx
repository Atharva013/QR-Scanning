import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchMedicineData } from "./fetchMedicine";

const MedicineDetails = () => {
    const { medicineId } = useLocalSearchParams(); // ✅ Correct way to get params
    const [medicineDetails, setMedicineDetails] = useState([]);
    const [currentOwner, setCurrentOwner] = useState("");
    const [previousOwners, setPreviousOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!medicineId) return; // ✅ Prevent fetching if no ID
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

    if (!medicineId) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: No Medicine ID provided.</Text>
            </View>
        );
    }

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Medicine Details</Text>

            {/* Medicine History */}
            {medicineDetails.length > 0 ? (
                <View>
                    <Text style={styles.subHeader}>Medicine History</Text>
                    {medicineDetails.map((record, index) => (
                        <View key={index} style={styles.recordContainer}>
                            {Object.entries(record).map(([key, value]) => (
                                <Text key={key} style={styles.recordText}>
                                    <Text style={styles.bold}>{key.replace(/([A-Z])/g, " $1").trim()}:</Text>{" "}
                                    {typeof value === "string" && Date.parse(value) ? new Date(value).toLocaleString() : value}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            ) : (
                <Text>No medicine history found.</Text>
            )}

            {/* Current Owner */}
            <Text style={styles.subHeader}>Current Owner</Text>
            <Text style={styles.ownerText}>{currentOwner}</Text>

            {/* Previous Owners */}
            {previousOwners.length > 0 && (
                <View>
                    <Text style={styles.subHeader}>Previous Owners</Text>
                    {previousOwners.map((owner, index) => (
                        <Text key={index} style={styles.ownerText}>{owner}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
    },
    recordContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    recordText: {
        fontSize: 16,
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
    ownerText: {
        fontSize: 16,
        marginTop: 5,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default MedicineDetails;
