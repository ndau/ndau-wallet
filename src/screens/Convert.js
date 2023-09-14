import React, { useEffect, useRef, useState } from 'react'
import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

import axios from 'axios'
import { images } from '../../assets/images'
import { ConvertIcon, NpayIcon, WalletSuccessSVGComponent } from '../assets/svgs/components'
import Button from '../components/Button'
import CustomText from '../components/CustomText'
import Loading from '../components/Loading'
import CustomModal from '../components/Modal'
import ScreenContainer from '../components/Screen'
import Spacer from '../components/Spacer'
import { themeColors } from '../config/colors'

const ConvertNdauToNpay = (props) => {

    const [errors, setErrors] = useState([]);
    const { totalBalance, dollorBalnce, image } = props?.route?.params ?? {}
    const [ndauAmount, setNdauAmount] = useState("");
    const [npayAmount, setNpayAmount] = useState("0.0");
    const [loaderValue, setLoaderValue] = useState("");
    const [exchangeRate, setExchangeRate] = useState("42013.14519");
    const modalRef = useRef(null)


    useEffect( async () => {
        const response =  await axios.get(
            `https://open.er-api.com/v6/latest/USD`
        );
        const usdToIdrRate = response?.data?.rates.IDR;
        console.log(usdToIdrRate, 'us------')
    }, [])


    const getRemainNdauBalance = (amount) => {
        try {
            const toShow = parseFloat((totalBalance - amount).toFixed(3));
            return toShow < 0 ? 0 : toShow
        } catch (e) {
            return "0"
        }
    }
  

    const handleConvert = () => {

        setLoaderValue("Converting NDAU to NPAY")

        setTimeout(() => {

            setLoaderValue("")
            if (exchangeRate && ndauAmount) {
                const convertedAmount = parseFloat(ndauAmount) * exchangeRate;
                setNpayAmount(convertedAmount.toFixed(2));
            } else {
                setNpayAmount("0.0");
            }
            modalRef.current(true)

        }, 2000)



    }
    const handleDone = () => {

        modalRef.current(false)

    }


    return (
        <ScreenContainer headerTitle={"Convert"}>

            {loaderValue && <Loading label={loaderValue} />}

            <Spacer height={20} />

            <View style={styles.headerView}>
                <Image style={styles.icon} source={image} />
                <Spacer height={18} />
                <View style={styles.balanceView}>
                    <CustomText semiBold h6>{`${(totalBalance || "0.00")}`}</CustomText>
                </View>
            </View>

            <View style={[styles.convertContainer1]}>


                <View style={styles.leftView}>
                    <CustomText>You Get</CustomText>

                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <Image style={styles.image} source={images.nDau} />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>NDAU</CustomText>
                        <Spacer width={2} />

                    </View>


                </View>
                <Spacer height={20} />
                <View style={styles.rightView}>

                    <View style={styles.row}>
                        <TextInput style={styles.inputCon}
                            placeholderTextColor={'#fff'}
                            placeholder='0.0'
                            value={parseFloat(ndauAmount)}
                            onChangeText={(t) => {
                                if (t[0] === "0" && t[1] === "0") return
                                if (/^\d*\.?\d*$/.test(t)) {
                                    setNdauAmount(t)
                                    if (parseFloat(t) <= parseFloat(totalBalance)) {
                                        setErrors([]);
                                    } else if (t.length > 0 && t !== ".") {
                                        setErrors(["Insufficent balance"]);
                                    }
                                } else {
                                    setErrors([]);
                                }
                            }}
                            maxLength={10}

                        />

                        {/* <Spacer width={4} />
                        <CustomText caption style={{ marginTop: 6 }}>{`~ $${parseFloat(dollorBalnce || 0)?.toFixed(2) || "0"}`}</CustomText> */}
                    </View>
                    <View style={styles.row}>
                        <CustomText body2 >{`Bal  :`}</CustomText>
                        <Spacer width={10} />
                        <CustomText body2 >{getRemainNdauBalance(ndauAmount)}</CustomText>
                    </View>
                </View>
            </View>

            <Spacer height={12} />

            <TouchableOpacity onPress={handleConvert} style={styles.svgView}>
                <ConvertIcon />
            </TouchableOpacity>

            <Spacer height={12} />

            <View style={[styles.convertContainer2]}>
                <View style={styles.leftView}>
                    <CustomText>You Get</CustomText>

                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <NpayIcon />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>NPAY</CustomText>
                        <Spacer width={2} />

                    </View>


                </View>
                <Spacer height={20} />
                <View style={styles.rightView}>

                    <View style={styles.row}>

                        <TextInput style={styles.inputCon}
                            placeholderTextColor={'#fff'}
                            placeholder='0.0'
                            value={npayAmount || 0.0}
                            editable={false}
                            selectTextOnFocus={false}
                        />

                        {/* <Spacer width={4} />
                        <CustomText caption style={{ marginTop: 6 }}>$177.55</CustomText> */}
                    </View>
                    <View style={styles.row}>
                        <CustomText body2 >{`Bal   :`}</CustomText>
                        <Spacer width={10} />
                        <CustomText body2 >{npayAmount}</CustomText>
                    </View>
                </View>
            </View>


            <CustomModal bridge={modalRef}>
                <View style={styles.modal}>
                    <WalletSuccessSVGComponent />
                    <CustomText titiliumSemiBold body style={{ textAlign: 'center' }}>
                        Your NDAU to NPAY conversion has been successful
                    </CustomText>
                </View>
                <Button label={"Done"} onPress={handleDone} />
            </CustomModal>

        </ScreenContainer>
    )
}

export default ConvertNdauToNpay

const styles = StyleSheet.create({

    convertContainer1: {
        borderRadius: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        padding: 10,
        borderColor: themeColors.orange,
        borderWidth: 1

    },
    convertContainer2: {
        borderRadius: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        padding: 10,
        borderColor: themeColors.primary,
        borderWidth: 1

    },
    leftView: {

        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    rightView: {


        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 24,
        height: 24,
        borderRadius: 100
    },
    selectCoin: {
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.white,
        padding: 6
    },
    svgView: {
        alignItems: 'center',
    },
    inputCon: {
        color: themeColors.white,
        fontWeight: "bold",
        fontSize: 18,

    },
    icon: {
        height: 60,
        width: 60,
        borderRadius: 30
    },

    headerView: {
        alignItems: 'center'
    },
    balanceView: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    modal: {
        alignItems: "center",
        marginVertical: 20,
    },

})