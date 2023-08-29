import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import Spacer from '../../../components/Spacer'
import CustomText from '../../../components/CustomText'
import { themeColors } from '../../../config/colors'
import NdauAccountLogoSVGComponent from '../../../assets/svgs/components/NdauLogoSvg'
import { images } from '../../../assets/images'

const AccountIemCard = ({ item, index }) => {
    return (
        <TouchableOpacity>
            <Animated.View style={styles.container}>

                <View style={styles.leftView}>
                    <View style={styles.image}>
                        <NdauAccountLogoSVGComponent />
                        {/* <Image source={images.ndauAccountImage} style={[{ position: "absolute", height: 90, width: 90, top: -1, left: -1, }]} /> */}
                    </View>
                    <Spacer width={105} />
                    <View>
                        <CustomText color={themeColors.white} body >Account 1</CustomText>
                        <CustomText color={themeColors.white} caption>3528dXaaswaxoc1wd........</CustomText>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <CustomText color={themeColors.white} body>16.12075</CustomText>
                    <CustomText color={themeColors.white} body2>≈$25.08</CustomText>
                </View>

            </Animated.View>
        </TouchableOpacity >
    )
}

export default AccountIemCard

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        borderRadius: 17,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: themeColors.white,
        marginBottom: 12,
        marginTop:12,
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
        paddingLeft:6


    },

})