import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";

const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-center pb-3">
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert("QR Code Scanned", data);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <CameraView
                style={{ flex: 1, width: "100%", height: "100%", backgroundColor: "black" }}
                ref={cameraRef}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && (
                <View style={{ position: "absolute", bottom: 20, left: 0, right: 0, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => setScanned(false)}
                        style={{ backgroundColor: "red", padding: 10, borderRadius: 10 }}
                    >
                        <Text style={{ color: "white" }}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CameraScreen;