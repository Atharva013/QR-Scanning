import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Animated, Vibration, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [torchOn, setTorchOn] = useState(false);
    const [scanAnimation] = useState(new Animated.Value(0));
    const [scannedData, setScannedData] = useState(null); // State to store scanned data
    const cameraRef = useRef(null);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnimation, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(scanAnimation, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }) => {
        Vibration.vibrate(100); // Vibrate on scan
        setScannedData(data); // Store the scanned data
        console.log("Scanned QR Code:", data);
    };

    const resetScanner = () => {
        setScannedData(null); // Reset the scanned data to allow re-scanning
    };

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                torch={torchOn ? "on" : "off"} // Use `torch` instead of `torchMode`
                onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned} // Disable scanning if data is already scanned
            >
                {/* Scanning Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        <Animated.View style={[styles.scanLine, {
                            top: scanAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 200],
                            }),
                        }]} />
                    </View>
                    <Text style={styles.scanText}>Align the QR code within the frame to scan</Text>
                </View>

                {/* Flashlight Toggle (Top Right Corner) */}
                <TouchableOpacity
                    onPress={() => setTorchOn(!torchOn)}
                    style={[styles.flashlightButton, torchOn && styles.flashlightButtonActive]}
                >
                    <Ionicons name={torchOn ? "flashlight" : "flashlight-outline"} size={28} color="white" />
                </TouchableOpacity>
            </CameraView>

            {/* Display Scanned Data */}
            {scannedData && (
                <View style={styles.scannedDataContainer}>
                    <Text style={styles.scannedDataText}>Scanned Data: {scannedData}</Text>
                    <TouchableOpacity onPress={resetScanner} style={styles.rescanButton}>
                        <Text style={styles.rescanButtonText}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    camera: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    permissionText: {
        textAlign: "center",
        paddingBottom: 20,
        fontSize: 16,
        color: "#333",
    },
    permissionButton: {
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 10,
    },
    permissionButtonText: {
        color: "white",
        fontSize: 16,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: "green",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    scanLine: {
        position: "absolute",
        width: "100%",
        height: 2,
        backgroundColor: "green",
    },
    scanText: {
        marginTop: 20,
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    flashlightButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 10,
        borderRadius: 50,
    },
    flashlightButtonActive: {
        backgroundColor: "#ffcc00",
    },
    scannedDataContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 20,
        alignItems: "center",
    },
    scannedDataText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 10,
    },
    rescanButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
    },
    rescanButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default CameraScreen;