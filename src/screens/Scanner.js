import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, Linking, AppState } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/Screen';
import CustomText from '../components/CustomText';

const Scanner = (props) => {
  const { onScan } = props?.route?.params ?? {};
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      let currentStatus = await Camera.getCameraPermissionStatus();

      if (currentStatus === 'not-determined') {
        currentStatus = await Camera.requestCameraPermission();
      }

      if (currentStatus === 'granted') {
        setHasPermission(true);
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
    };

    checkAndRequestPermission();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        await checkAndRequestPermission();
      }
    });

    return () => {
      subscription.remove();
    };

  }, [navigation]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (isScannerActive && codes.length > 0 && codes[0].value) {
        const scannedValue = codes[0].value;
        setIsScannerActive(false);
        onScan?.(scannedValue);
        navigation.goBack();
      }
    },
  });

  if (!hasPermission) {
    return (
      <ScreenContainer>
        <CustomText style={{ textAlign: 'center', marginTop: 50 }}>
          Requesting camera permission...
        </CustomText>
      </ScreenContainer>
    );
  }

  if (device == null) {
    return (
      <ScreenContainer>
        <CustomText style={{textAlign: 'center', marginTop: 50}}>
          No suitable camera device found.
        </CustomText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && isScannerActive && AppState.currentState === 'active'}
        codeScanner={codeScanner}
      />
    </ScreenContainer>
  );
};

export default Scanner;
