import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = ({ data }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned', data);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleScan}
      />
      {scanned && <Button title='Scan Again' onPress={() => setScanned(false)} />}
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});