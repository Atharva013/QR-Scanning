import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Alert
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { fetchMedicineData } from "./fetchMedicine";
import { analyzeMedicineRecords } from "./Analyzergemini";

const MedicineDetails = () => {
    const { medicineId } = useLocalSearchParams();
    const [medicineDetails, setMedicineDetails] = useState([]);
    const [currentOwner, setCurrentOwner] = useState("");
    const [previousOwners, setPreviousOwners] = useState([]);
    const [sensorStats, setSensorStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        if (!medicineId) return;
        const loadMedicineData = async () => {
            const data = await fetchMedicineData(medicineId);
            if (data) {
                setMedicineDetails(data.medicineData || []);
                setCurrentOwner(data.currentOwner || "Unknown");
                setPreviousOwners(data.previousOwners || []);
                setSensorStats(data.sensorStats || null);

                const analysis = await analyzeMedicineRecords(data.medicineData);
                setAnalysisResult(analysis);
            }
            setLoading(false);
        };
        loadMedicineData();
    }, [medicineId]);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(currentOwner);
        Alert.alert("Copied!", "Current owner address has been copied to clipboard.");
    };

    if (!medicineId) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: No Medicine ID provided.</Text>
            </View>
        );
    }

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        <ImageBackground source={require("../assets/images/image.png")} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.blueTitle}>Medicine Details</Text>

                {analysisResult && (
                    <View style={[styles.analysisContainer, analysisResult.startsWith("Flagged") ? styles.flagged : styles.legitimate]}>
                        <Text style={styles.analysisText}>{analysisResult}</Text>
                    </View>
                )}

                {medicineDetails.length > 0 ? (
                    <View>
                        <Text style={styles.blueTitle}>Medicine History</Text>
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

                <Text style={styles.subHeader}>Current Owner</Text>
                <View style={styles.ownerContainer}>
                    <Text style={styles.ownerText}>{currentOwner}</Text>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <Ionicons name="copy-outline" size={24} color="#007bff" />
                    </TouchableOpacity>
                </View>

                {previousOwners.length > 0 && (
                    <View>
                        <Text style={styles.subHeader}>Previous Owners</Text>
                        {previousOwners.map((owner, index) => (
                            <Text key={index} style={styles.ownerText}>{owner}</Text>
                        ))}
                    </View>
                )}

                {/* Updated Sensor Statistics Handling */}
                {sensorStats && typeof sensorStats === "object" && (
                    <View style={styles.sensorContainer}>
                        <Text style={styles.blueTitle}>Sensor Statistics</Text>
                        <Text style={styles.sensorText}>Average Temperature: {sensorStats.average}°C</Text>
                        <Text style={styles.sensorText}>Min Temperature: {sensorStats.min}°C</Text>
                        <Text style={styles.sensorText}>Max Temperature: {sensorStats.max}°C</Text>
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    blueTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#007bff",
        marginBottom: 10,
        textAlign: "center",
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
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    recordText: {
        fontSize: 16,
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
    ownerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    ownerText: {
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    analysisContainer: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
    },
    flagged: {
        backgroundColor: "#ffcccc",
        borderColor: "#ff0000",
        borderWidth: 1,
    },
    legitimate: {
        backgroundColor: "#ccffcc",
        borderColor: "#008000",
        borderWidth: 1,
    },
    analysisText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default MedicineDetails;
