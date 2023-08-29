import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { themeColors } from '../../../config/colors'
import CustomText from '../../../components/CustomText'
import NdauLogoSVGComponent from '../../../assets/svgs/components/NdauSvg'
import Spacer from '../../../components/Spacer'
import Button from '../../../components/Button'
import { Plus } from '../../../assets/svgs/components'

const NdauAddAccounHeaderCard = ({ addAccountPress }) => {

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.row}>
                    <NdauLogoSVGComponent />
                    <Spacer width={10} />
                    <CustomText color={themeColors.white} body>My NDAU Accounts</CustomText>
                </View>
                <View style={styles.totalAccountCon}>
                    <CustomText color={themeColors.black} body2>4 accounts</CustomText>
                </View>
            </View>
            <Spacer height={20} />
            <View style={styles.footerView}>
                <View>
                    <CustomText color={themeColors.white} body>ndau Balance</CustomText>
                    <Spacer height={8} />
                    <CustomText color={themeColors.white} bold h3>64.483745</CustomText>
                    <Spacer height={8} />
                    <CustomText color={themeColors.white} body>≈$100.34</CustomText>
                </View>
                <View>
                    <Spacer height={30} />
                    <Button
                        onPress={addAccountPress}
                        rightIcon={<Plus />}
                        buttonContainerStyle={styles.addAccountButton} />
                </View>
            </View>


        </View>
    )
}

export default NdauAddAccounHeaderCard


const styles = StyleSheet.create({

    container: {
        backgroundColor: themeColors.orange,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 25,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    totalAccountCon: {
        backgroundColor: themeColors.white,
        borderRadius: 100,
        padding: 8
    },
    footerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    addAccountButton: {
        backgroundColor: themeColors.lightBackground,
        height: 40,
        width: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },



})