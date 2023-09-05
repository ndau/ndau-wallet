import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import Spacer from '../../../components/Spacer'
import CustomText from '../../../components/CustomText'
import { themeColors } from '../../../config/colors'
import NdauAccountLogoSVGComponent from '../../../assets/svgs/components/NdauLogoSvg'
import { images } from '../../../assets/images'

const AccountItemCard = ({ item, disabled, onItemClick }) => {

    const makeStringShort = (val) => {
        return val.length < 20
            ? `${val}`
            : `${val.substring(0, 20)}.......`
    }

    return (
        <TouchableOpacity disabled={disabled} onPress={() => onItemClick(item)}>
            <Animated.View style={[styles.container, disabled && { opacity: 0.5 }]}>

                <View style={styles.leftView}>
                    <View style={styles.image}>
                        <NdauAccountLogoSVGComponent />
                        {/* <Image source={images.ndauAccountImage} style={[{ position: "absolute", height: 90, width: 90, top: -1, left: -1, }]} /> */}
                    </View>
                    <Spacer width={105} />
                    <View>
                        <CustomText color={themeColors.white} body >{item?.addressData?.nickname}</CustomText>
                        <CustomText color={themeColors.white} caption>{makeStringShort(item?.address)}</CustomText>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <CustomText color={themeColors.white} body>{(parseFloat(item.totalFunds || 0)?.toFixed(4)) || 0}</CustomText>
                    <CustomText color={themeColors.white} body2>≈{(parseFloat(item.usdAmount || 0)?.toFixed(4)) || 0}</CustomText>
                </View>

            </Animated.View>
        </TouchableOpacity >
    )
}

export default AccountItemCard

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        borderRadius: 17,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: themeColors.white,
        marginBottom: 12,
        marginTop: 12,
        marginLeft: 2,
        justifyContent: 'space-between',
        alignItems: "center",
        height: 75,

    },
    leftView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightView: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 16
    },
    image: {
        width: 80,
        height: 80,
        backgroundColor: "black",
        position: 'absolute',
        left: -1,
        justifyContent: "flex-end",
        paddingTop: 0,
        paddingLeft: 6


    },

})