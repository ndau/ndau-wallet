import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomText from '../../components/CustomText'
import { themeColors } from '../../config/colors'
import { ArrowRightSVGComponent } from '../../assets/svgs/components'
import Spacer from '../../components/Spacer'
import { TouchableOpacity } from 'react-native-gesture-handler'

const DashBoardBottomSheetCard = ({ rightSvg, label, title, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftView}>
                {rightSvg}
                <Spacer width={12} />
                <View>
                    <CustomText bold body color={themeColors.white}>{label}</CustomText>
                    <CustomText body2 color={themeColors.white}>{title}</CustomText>
                </View>
            </View>
            <ArrowRightSVGComponent />
        </TouchableOpacity>
    )
}

export default DashBoardBottomSheetCard


const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.primary,
        marginBottom: 25



    },
    leftView: {
        flexDirection: "row",
        alignItems: "center",
    }

})