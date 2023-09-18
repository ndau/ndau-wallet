import React, { useCallback } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from "react-native-reanimated"
import { NotificationDelete, NotificationFailed, NotificationSuccess, RoundEtheriumIcon, RoundNdauIcon, RoundUsdcIcon } from '../../../assets/svgs/components'
import CustomText from '../../../components/CustomText'
import Spacer from '../../../components/Spacer'
import { format } from 'date-fns'
import { Image } from 'react-native-svg'
import NdauLogoSVGComponent from '../../../assets/svgs/components/NdauSvg'
import NdauAccountLogoSVGComponent from '../../../assets/svgs/components/NdauLogoSvg'

const NotificationCard = ({ item, index, onDelete }) => {

    const formattedTime = (timestamp) => {
        // const date = new Date(timestamp);
        // const formattedTime = date.toLocaleTimeString([], {
        //     hour: 'numeric',
        //     minute: '2-digit',
        //     hour12: true,
        // });
        const date = new Date(timestamp);

        // Format the date as a string
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm a');
        return formattedDate
    }

    const makeStringShort = (val) => {

        if (val.length > 0) {

            const prefix = val?.slice(0, 4);
            const suffix = val?.slice(-4);

            return `${prefix}....${suffix}`;
        }


    }

    const setWalletIcon = useCallback((type) => {

        if (type === "ndau") {
            return <RoundNdauIcon />
        }
        else if (type === "npay") {
            return <RoundNdauIcon />
        }
        else if (type === "erc") {
            return <RoundEtheriumIcon />
        }
        else if (type === "usdc") {
            return <RoundUsdcIcon />
        }

    }, [])




    return (
        <View style={styles.container}>
            {item?.isBoolean ?
                <View style={{ padding: 6 }}>
                    <NotificationSuccess />

                    <View style={styles.svg} >
                        {setWalletIcon(item?.type)}
                    </View>
                </View> : <NotificationFailed />}
            <Spacer width={10} />
            <Animated.View entering={FadeInDown.delay(100 * index)}>
                <View style={styles.row}>
                    <View>
                        <CustomText body semiBold >{item.message}</CustomText>
                        <Spacer height={6} />
                        <View style={styles.row3}>
                            <View style={styles.row2}>
                                <CustomText body2 semiBold >{`To :  `}</CustomText>
                                <CustomText body2 > {makeStringShort(item?.transaction?.toAddress)}</CustomText>
                            </View>

                            <View style={styles.row2}>
                                <CustomText body2 semiBold >{`From :  `}</CustomText>
                                <CustomText body2  > {makeStringShort(item?.transaction?.fromAddress)}</CustomText>
                            </View>
                            <Spacer height={4} />
                        </View>
                    </View>
                    <Spacer width={14} />

                </View>
                <Spacer height={6} />


                <View style={styles.row2}>
                    <CustomText body2 semiBold >{`Date :  `}</CustomText>
                    <CustomText body2 color='#fff'>{formattedTime(item?.id)}</CustomText>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={onDelete} style={styles.deleteSvg}>
                    <NotificationDelete />
                </TouchableOpacity>

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
        alignItems: 'center'
    },
    row3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16
    },

    svg: {
        position: 'absolute',
        right: 4,
        top: 35
    },
    deleteSvg: {
        right: 35,
        top: 35,
        position: 'absolute'
    }


})


export default NotificationCard