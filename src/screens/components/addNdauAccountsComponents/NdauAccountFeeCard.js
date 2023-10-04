import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Spacer from '../../../components/Spacer'
import CustomText from '../../../components/CustomText'
import { images } from '../../../assets/images'
import { themeColors } from '../../../config/colors'
import Button from '../../../components/Button'
import ModalTextLink from '../../../components/common/ModalTextLink'
import AppConfig from '../../../AppConfig'

const NdauAccountFeeCard = ({ onUnderstand, onCancel, item, isCancel, isReceive }) => {
    return (

        <View style={styles.container}>
            <Spacer height={25} />
            <Image style={styles.image} source={images.nDau} />
            <Spacer height={25} />
            <CustomText body bold color='white' style={{ textAlign: 'center' }}>
                {isReceive ? "ndau  receive  fees" : "ndau new account fees"}
            </CustomText>
            <Spacer height={12} />

            <View style={styles.divider} />
            <Spacer height={12} />
            <CustomText body2 color='white' style={{ textAlign: 'center' }}>The first deposit recieved by a newly created account is subject to a small fee that supports the operation of the ndau network</CustomText>
            <Spacer height={12} />

            <View style={styles.feeSection}>
                <View style={styles.feeSectionRow}>
                    <CustomText body2 color='white' style={{ textAlign: 'center' }}>
                        Delegate Fee
                    </CustomText>
                    <CustomText body2 color='white' style={{ textAlign: 'center' }}>
                        (0.005 ndau)
                    </CustomText>

                </View>
                <Spacer height={12} />
                <View style={styles.feeSectionRow}>
                    <CustomText body2 color='white' style={{ textAlign: 'center' }}>
                        SetValidation Fee
                    </CustomText>
                    <CustomText body2 color='white' style={{ textAlign: 'center' }}>
                        (0.005 ndau)
                    </CustomText>
                </View>
            </View>
            <Spacer height={8} />
            <ModalTextLink url={AppConfig.TRANSACTION_FEE_KNOWLEDGEBASE_URL}>
                Read more about fees...
            </ModalTextLink>
            <Spacer height={12} />
            <Button
                label={"I understand & continue"}
                onPress={onUnderstand}
                buttonContainerStyle={styles.understandBtn} />
            <Spacer height={12} />
            {isCancel && <Button

                label={"Cancel"}
                onPress={onCancel}
                buttonContainerStyle={styles.cancelBtn} />}

        </View>


    )
}

export default NdauAccountFeeCard

const styles = StyleSheet.create({

    container: {
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60
    },
    divider: {
        backgroundColor: 'grey',
        height: 1,
        width: Dimensions.get('window').width / 1.3
    },
    feeSection: {
        borderRadius: 12,
        backgroundColor: themeColors.modalBackground,
        borderWidth: .2,
        borderColor: 'white',
        width: '100%',
        height: 60,
        paddingHorizontal: 12,
        justifyContent: 'center'
    },
    feeSectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    understandBtn: {
        backgroundColor: themeColors.primary,
        width: Dimensions.get('window').width / 1.18
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width / 1.18,
        borderColor: themeColors.white,
        borderWidth: 1
    }

})