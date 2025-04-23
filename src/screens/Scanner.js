import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, Linking, AppState } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/Screen';

const Scanner = (props) => {
  const { onScan } = props?.route?.params ?? {};
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');

  const [hasPermission, setHasPermission] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const scannedRef = useRef(false);

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      try {
        let currentStatus = await Camera.getCameraPermissionStatus();

        if (currentStatus !== 'granted') {
          currentStatus = await Camera.requestCameraPermission();
        }

        if (currentStatus === 'granted') {
          setHasPermission(true);
          setTimeout(() => setIsScannerActive(true), 100);
        } else {
          setHasPermission(false);
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permission in settings to scan QR codes.',
            [
              { text: 'Cancel', onPress: () => navigation.goBack(), style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      } catch (error) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
      }
    };

    if (isFocused) {
      checkAndRequestPermission();
      scannedRef.current = false;
    } else {
      setIsScannerActive(false);
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isFocused) {
        checkAndRequestPermission();
      } else if (nextAppState !== 'active') {
        setIsScannerActive(false);
      }
    });

    return () => {
      subscription.remove();
      setIsScannerActive(false);
    };
  }, [isFocused]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (scannedRef.current || !isScannerActive || !codes.length) {
        return;
      }

      const scannedValue = codes[0]?.value;
      if (!scannedValue) {
        return;
      }

      scannedRef.current = true;
      setIsScannerActive(false);
      onScan?.(scannedValue);
      navigation.goBack();
    },
  });

  if (!hasPermission || !device || !isFocused || scannedRef.current) {
    return <ScreenContainer />;
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isScannerActive}
      codeScanner={codeScanner}
    />
  );
};

export default Scanner;
