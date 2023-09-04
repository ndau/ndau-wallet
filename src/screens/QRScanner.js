import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScanner = () => {
  const handleQRCodeScanned = (e) => {
    console.log('QR Code Scanned:', e.data);
  };

  return (
    <View style={styles.container}>
      {/* <QRCodeScanner
        onRead={handleQRCodeScanned}
        cameraStyle={styles.camera}
        reactivate={true}
      /> */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

export default QRScanner;
