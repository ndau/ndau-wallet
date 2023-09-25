import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from "react-native-reanimated"

import { images } from '../../../../assets/images'
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
        else if (type === tokenShortName.MATIC) {
            return <View style={styles.maticImgCon}>
                <Image style={styles.maticImg} source={images.polygonIconImage} />
            </View>
        }
    }, [])

    return (
        <View style={styles.container}>
            {item?.isBoolean ?
                <View>
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
            <Animated.View style={{ flex: 1 }} entering={FadeInDown.delay(100 * index)}>
                <View style={styles.row}>
                    <View style={styles.main}>
                        <View>
                            <CustomText body titiliumBold>{item.message}</CustomText>
                            <View style={styles.row3}>
                                <View style={styles.row2}>
                                    <CustomText body2 titiliumBold >{`To :`}</CustomText>
                                    <CustomText body2 titilium> {makeStringShort(item?.transaction?.toAddress)}</CustomText>
                                </View>
                                <View style={styles.row2}>
                                    <CustomText body2 titiliumBold >{`From :`}</CustomText>
                                    <CustomText body2 titilium> {makeStringShort(item?.transaction?.fromAddress)}</CustomText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={onDelete} style={styles.deleteSvg}>
                            <NotificationDelete />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row2}>
                    <CustomText body2 titiliumBold >{`Date :  `}</CustomText>
                    <CustomText body2 titilium>{formattedTime(item?.id)}</CustomText>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    column: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
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
        right: -2,
        top: 25
    },
    deleteSvg: {
        alignSelf: 'flex-end'
    },
    maticImgCon: {
        width: 20,
        height: 20
    },
    maticImg: {
        width: 20,
        height: 20
    }
})

export default NotificationCard