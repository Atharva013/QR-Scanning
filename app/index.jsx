import { View, Text, StyleSheet, SafeAreaView, Pressable, ImageBackground } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import CameraScreen from './camera'; // Adjust the path if necessary
// Import your background image
import backgroundImage from '../assets/images/otty.jpg'; // Ensure the path and extension are correct

const Home = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Overview", headerShown: false }} />
        <Text style={styles.title}>QR Code Scanner</Text>
        <View style={{ gap: 20 }}>
          <Pressable onPress={requestPermission}>
            <Text style={styles.buttonStyle}>Request Permissions</Text>
          </Pressable>
          <Link href={"/camera"} asChild>
            <Pressable disabled={!isPermissionGranted}>
              <Text
                style={[
                  styles.buttonStyle,
                  { opacity: !isPermissionGranted ? 0.5 : 1 },
                ]}
              >
                Scan Code
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});