import { View, Text, StyleSheet, SafeAreaView, Pressable, ImageBackground } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useState } from "react";
import CameraScreen from "./camera"; // Adjust the path if necessary
import backgroundImage from "../assets/images/otty.jpg"; // Ensure the path is correct

const Home = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [scannedMedicineId, setScannedMedicineId] = useState(null);

    const isPermissionGranted = Boolean(permission?.granted);

    // Handle scanned medicine ID and navigate to MedicineDetails
    const handleScan = (medicineId) => {
        setScannedMedicineId(medicineId);
        router.push({ pathname: "/MedicineDetails", params: { medicineId } });
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: "Overview", headerShown: false }} />
                <Text style={styles.title}>QR Code Scanner</Text>

                <View style={styles.buttonContainer}>
                    {!isPermissionGranted ? (
                        <Pressable onPress={requestPermission} style={styles.button}>
                            <Text style={styles.buttonText}>Request Permissions</Text>
                        </Pressable>
                    ) : (
                        <Link href={"/camera"} asChild>
                            <Pressable style={styles.button}>
                                <Text style={styles.buttonText}>Scan Code</Text>
                            </Pressable>
                        </Link>
                    )}
                </View>

                {scannedMedicineId && (
                    <Pressable 
                        onPress={() => router.push({ pathname: "/MedicineDetails", params: { medicineId: scannedMedicineId } })}
                        style={styles.detailsButton}
                    >
                        <Text style={styles.detailsButtonText}>View Medicine Details</Text>
                    </Pressable>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Home;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        color: "white",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        gap: 20,
    },
    button: {
        backgroundColor: "#0E7AFE",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
    },
    detailsButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "green",
        borderRadius: 10,
    },
    detailsButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
