import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { themeColors } from '../../../config/colors'
import CustomText from '../../../components/CustomText'
import Spacer from '../../../components/Spacer'
import Animated, { FadeInDown } from "react-native-reanimated";
import { NotificationDelete, NotificationFailed, NotificationSuccess } from '../../../assets/svgs/components'

const NotificationCard = ({ item, index, onDelete }) => {

    const formattedTime = (timestamp) => {
        const date = new Date(timestamp);
        const formattedTime = date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return formattedTime
    }

    return (
        <View style={styles.container}>
            {item?.isBoolean ? <NotificationSuccess /> : <NotificationFailed />}
            <Spacer width={10} />
            <Animated.View entering={FadeInDown.delay(100 * index)}>
                <View style={styles.row}>
                    <CustomText body semiBold style={styles.message}>{item?.message}</CustomText>
                    <Spacer width={14} />
                    <TouchableOpacity activeOpacity={0.8} onPress={onDelete} style={styles.deleteSvg}>
                        <NotificationDelete />
                    </TouchableOpacity>
                </View>
                <Spacer height={4} />

                <CustomText body2>{formattedTime(item?.id)}</CustomText>

            </Animated.View>
        </View>

    )
}


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        marginBottom: 25,

    },

    column: {
        alignItems: 'center',
    },

    message: {
        width: 250
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,

        width: Dimensions.get('window').width / 1.24
    },
    row2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    deleteSvg: {



    },


})


export default NotificationCard