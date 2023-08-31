import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import CrossSVGComponent from '../../../assets/svgs/components/CrossSvg'
import Spacer from '../../../components/Spacer'
import { NDauLogo, Plus } from '../../../assets/svgs/components'
import NdauLogoSVGComponent from '../../../assets/svgs/components/NdauSvg'
import { images } from '../../../assets/images'
import CustomText from '../../../components/CustomText'
import { themeColors } from '../../../config/colors'
import Button from '../../../components/Button'
import Minus from '../../../assets/svgs/components/MinusSvg'

const AddAccountPopupCard = ({ val, increment, decrement, addAccount, onCancel }) => {



    return (
        <View>
            <TouchableOpacity onPress={onCancel}>
                <CrossSVGComponent />
            </TouchableOpacity>
            <View style={styles.container}>

                <Spacer height={25} />
                <Image style={styles.image} source={images.nDau} />
                <Spacer height={25} />
                <CustomText body color='white' style={{ textAlign: 'center' }}>
                    How many ndau accounts would you like to add to your wallet?
                </CustomText>
                <Spacer height={15} />
                <View>
                    <CustomText h2 bold color='white'>{val}</CustomText>
                    <View style={styles.divider} />
                </View>
                <Spacer height={30} />
                <View style={styles.buttonContain}>
                    <TouchableOpacity style={styles.button} onPress={decrement} activeOpacity={0.6}>
                        <Minus />
                    </TouchableOpacity>
                    <Spacer width={10} />
                    <TouchableOpacity style={styles.button} onPress={increment} activeOpacity={0.6}>
                        <Plus />
                    </TouchableOpacity>
                </View>
                <Spacer height={30} />
                <Button
                    label={"Add"}
                    onPress={addAccount}
                    buttonContainerStyle={styles.adBtn} />

            </View>
        </View>

    )
}

export default AddAccountPopupCard

const styles = StyleSheet.create({

    container: {
        alignItems: 'center'
    }
    , image: {
        width: 60,
        height: 60
    },
    divider: {
        backgroundColor: 'gray',
        height: 1
    },

    buttonContain: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    button: {
        // width: 160,
        height: 54,
        paddingHorizontal: 62,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: themeColors.white,
        alignItems: 'center',
        justifyContent: 'center',

    },
    adBtn: {
        backgroundColor: themeColors.primary,
        width: Dimensions.get('window').width / 1.18
    }

})