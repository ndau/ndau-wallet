import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from "react-native-reanimated"

import { NotificationDelete, NotificationFailed, NotificationSuccess, RoundEtheriumIcon, RoundNdauIcon, RoundNpayIcon, RoundUsdcIcon } from '../../../assets/svgs/components'
import CustomText from '../../../components/CustomText'
import Spacer from '../../../components/Spacer'
import { tokenShortName } from '../../../utils'

const NotificationCard = ({ item, index, onDelete }) => {

    const formattedTime = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm a');
        return formattedDate
    }

    const makeStringShort = (val) => {
        if (val.length > 0) {
            let prefix = val?.slice(0, 4);
            let suffix = val?.slice(-4);
            return `${prefix}....${suffix}`;
        }
    }

    const setWalletIcon = useCallback((type) => {

        if (type === tokenShortName.NDAU) {
            return <RoundNdauIcon />
        }
        else if (type === tokenShortName.NPAY) {
            return <RoundNpayIcon />
        }
        else if (type === tokenShortName.ETHERERUM) {
            return <RoundEtheriumIcon />
        }
        else if (type === tokenShortName.USDC) {
            return <RoundUsdcIcon />
        }

    }, [])


    return (
        <View style={styles.container}>
            {item?.isBoolean ?
                <View style={{ padding: item?.isBoolean ? 6 : 0 }}>
                    <NotificationSuccess />
                    <View style={styles.svg} >
                        {setWalletIcon(item?.type)}
                    </View>
                </View>
                :
                <View style={styles.svgFailed} >
                    <NotificationFailed />
                </View>
            }

            <Spacer width={10} />

            <Animated.View entering={FadeInDown.delay(100 * index)}>
                <View style={styles.row}>
                    <View style={styles.main}>

                        <View>
                            <CustomText body semiBold style={styles.message}>{item.message}</CustomText>
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
                            </View>
                        </View>

                        <TouchableOpacity activeOpacity={0.8} onPress={onDelete} style={styles.deleteSvg}>
                            <NotificationDelete />
                        </TouchableOpacity>
                    </View>
                </View>

                <Spacer height={6} />

                <View style={styles.row2}>
                    <CustomText body2 semiBold >{`Date :  `}</CustomText>
                    <CustomText body2 color='#fff'>{formattedTime(item?.id)}</CustomText>
                </View>
            </Animated.View>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        marginBottom: 25,
        justifyContent: 'center'
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    column: {
        alignItems: 'center',
    },
    message: {
        width: Dimensions.get('window').width / 1.4
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
        alignSelf: 'flex-end'
    },
})

export default NotificationCard