import { View, Text, StyleSheet, Share } from 'react-native'
import React from 'react'
import ScreenContainer from '../components/Screen'
import CustomText from '../components/CustomText'
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import  ShareIcon from '../assets/svgs/ShareSvg'
import { themeColors } from '../config/colors'
import QRCode from 'react-native-qrcode-svg';
import CopyAddressButton from '../components/CopyAddressButton'
import Clipboard from '@react-native-clipboard/clipboard'
import { ScreenNames } from './ScreenNames'

const Receive = (props) => {
    let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  
    const shareQRCode =  async () => {
      props.navigation.navigate("QRCodeScannerScreen")

        // try {
        //   const result = await Share.share({
        //     message:
        //       '0xb5300b33A656A291f4400D76fD9572011698EC71',
        //   });
        //   if (result.action === Share.sharedAction) {
        //     if (result.activityType) {
        //       // shared with activity type of result.activityType
        //     } else {
        //       // shared
        //     }
        //   } else if (result.action === Share.dismissedAction) {
        //     // dismissed
        //   }
        // } catch (error) {
        //   alert(error.message);
        // }
      };


    return (
        <ScreenContainer headerTitle='Receive'>

            <Spacer height={20} />
            <CustomText body >
                To receive ndau in your account, present this QR code or ndau address to the sender.
            </CustomText>
            <Spacer height={100} />

            <View style={styles.qrCodeContainer}>
                <QRCode
                    value="0xb5300b33A656A291f4400D76fD9572011698EC71"
                    size={150}
                    color='black'
                    backgroundColor='white'
                />
            </View>

            <Spacer height={20} />
            <View style={styles.copyAddress}>
                <CopyAddressButton label={"Copy Address"} customStyles={{ width: 170 }} onPress={() => {
                    Clipboard.setString("0xb5300b33A656A291f4400D76fD9572011698EC71")
                }} />
            </View>


            <View style={styles.btnContainer}>
                <Button
                    label={'Share'}
                    iconLeft={<ShareIcon />}
                    buttonContainerStyle={styles.shareButon}
                    btnTextStyle={styles.btnTextlabel}
                    onPress={shareQRCode}
                />
            </View>

        </ScreenContainer>
    )
}

export default Receive


const styles = StyleSheet.create({

    btnContainer: {
        justifyContent: 'flex-end',
        flex: 1,
        paddingBottom: 25

    },
    shareButon: {
        backgroundColor: themeColors.primary,
        flexDirection: "row",
        alignItems: "center"

    },
    btnTextlabel: { marginLeft: 6 },

    qrCodeContainer: {
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white'
    },
    copyAddress: {
        alignItems: 'center'
    }
})