import React, { useEffect, useRef, useState } from 'react'
import {
    Image,
    StyleSheet,
    TextInput,
    View
} from 'react-native'

import { images } from '../../assets/images'
import { ConvertIcon, NpayIcon, WalletSuccessSVGComponent } from '../assets/svgs/components'
import Button from '../components/Button'
import CustomText from '../components/CustomText'
import Loading from '../components/Loading'
import CustomModal from '../components/Modal'
import ScreenContainer from '../components/Screen'
import Spacer from '../components/Spacer'
import FlashNotification from '../components/common/FlashNotification'
import { themeColors } from '../config/colors'
import { useTransaction, useWallet } from '../hooks'
import useConvert from '../hooks/useConvert'
import UserStore from "../stores/UserStore"
import { ndauUtils } from '../utils'

const ConvertNdauToNpay = (props) => {

    const [errors, setErrors] = useState([]);
    const { totalBalance, ndauAddress, image, ndauPrivateKey, npayAddressVal } = props?.route?.params ?? {}
    const [ndauAmount, setNdauAmount] = useState("");
    const [npayAddress, setNpayAddress] = useState(npayAddressVal);
    const [npayAmount, setNpayAmount] = useState("0.0");
    const [loaderValue, setLoaderValue] = useState("");
    const modalRef = useRef(null)
    const modalRef2 = useRef(null)
    const { sigedErcWallet, ndauConversion } = useConvert()
    const { getActiveWallet } = useWallet()
    const { sendAmountToNdauAddress } = useTransaction();


    useEffect(() => {
        setNpayAddress(npayAddress)
    }, [npayAddress])

    const getRemainNdauBalance = (amount) => {
        try {
            const toShow = parseFloat((totalBalance - amount).toFixed(3));
            return toShow < 0 ? 0 : toShow
        } catch (e) {
            return "0"
        }
    }

    const finalPayload = (data, newPayload) => {
        return {
            domain: {
                name: 'zkSync',
                version: '2',
                chainId: newPayload.chainId
            },
            types: {
                Convert: [
                    { name: 'ndau_address', type: 'address' },
                    { name: 'npay_address', type: 'address' },
                    { name: 'signature2', type: 'string' },
                    { name: 'amount', type: 'uint' },
                    { name: 'nonce', type: 'unint' }
                ]
            },
            primary_type: "Convert",
            message: {
                TxHash: data?.TxHash,
                amount: data?.amount,
                ndau_address: data?.ndau_address,
                npay_address: data?.npay_address,
                signature2: newPayload?.signature2,
                nonce: newPayload.nonceVal
            },
            signature: newPayload?.signature1
        }
    }

    const handleConvert = () => {
        setLoaderValue("Signing")
        sendAmountToNdauAddress(
            UserStore.getAccountDetail(ndauAddress),
            "ndnf5mpi9a688btwhsjfym46v4kk5tat2p6494m2bq8h8hce", // converter address
            ndauAmount
        ).then(response => {
            const payload = {
                TxHash: response.hash,
                amount: ndauAmount,
                ndau_address: ndauAddress,
                npay_address: npayAddress,
            }
            sigedErcWallet(payload, ndauPrivateKey).then((res) => {
                const conversionPayload = finalPayload(payload, res)
                console.log(JSON.stringify(conversionPayload, null, 2), 'payload---')
                ndauConversion(conversionPayload).then((res) => {
                    setLoaderValue("")

                }).catch(err => {
                    setLoaderValue("")
                    FlashNotification.show(err.message);
                })
            }).catch(err => {
                setLoaderValue("")
                FlashNotification.show(err.message);
            })
        }).catch(err => {
            setLoaderValue("")
            FlashNotification.show(err.message);
        })
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
                    <CustomText semiBold h6>{`${(totalBalance || 0.0)}`}</CustomText>
                </View>
            </View>

            <View style={[styles.convertContainer1]}>
                <View style={styles.leftView}>
                    <CustomText>{`From :  ${ndauUtils.truncateAddress(ndauAddress)}`}</CustomText>
                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <Image style={styles.image} source={images.nDau} />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>ndau</CustomText>
                        <Spacer width={2} />
                    </View>
                </View>
                <Spacer height={20} />
                <View style={styles.rightView}>
                    <View style={styles.row}>
                        <TextInput style={styles.inputCon}
                            placeholderTextColor={'#fff'}
                            placeholder='0.0'
                            keyboardType='number-pad'
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
            <View style={styles.svgView}>
                <ConvertIcon />
            </View>
            <Spacer height={12} />

            <View style={[styles.convertContainer2]}>
                <View style={styles.leftView}>
                    <View style={styles.npayRowCon}>
                        <View>
                            <CustomText>To :</CustomText>
                            <Spacer height={4} />
                            <TextInput style={styles.inputConNpay}
                                placeholderTextColor={'grey'}
                                placeholder='address'
                                value={npayAddress}
                                editable={!npayAddressVal}
                                onChangeText={(t) => {
                                    setNpayAddress(t)
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <NpayIcon />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>npay</CustomText>
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

            <View style={styles.convertBtn}>
                <Button label={"Convert"} onPress={handleConvert} disabled={ndauAmount.length === 0 || totalBalance === 0 || getRemainNdauBalance(ndauAmount) === 0 || npayAddress === ""} />
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

            <CustomModal bridge={modalRef2}>
                <View style={styles.modal}>
                    <CustomText h5 semiBold>NOTE</CustomText>
                    <Spacer height={20} />
                    <View style={styles.divider} />
                    <Spacer height={20} />
                    <CustomText body>NDAU is converted to NPAY on a 1:1 basis.  All NDAU converted from this NDAU address will be sent to your NPAY address that is listed under the “Tokens” screen in this wallet app.</CustomText>
                </View>
                <View>
                    <Button label={"I Understand"} onPress={() => modalRef2.current(false)} />
                    <Spacer height={12} />
                    <Button label={"Cancel"} onPress={() => modalRef2.current(false)} buttonContainerStyle={styles.cancelBtn} />
                </View>
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
    inputConNpay: {
        color: 'white',
        fontSize: 10,

        flex: 1
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
    convertBtn: {
        justifyContent: 'flex-end',
        flex: 1
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: 'grey',
    },
    cancelBtn: {
        backgroundColor: "transparent",
        borderColor: 'white',
        borderWidth: 1
    },
    outlineButton: {
        backgroundColor: undefined,
        borderWidth: 2,
        borderColor: themeColors.primary,
        height: 30,
        padding: 0,
        paddingHorizontal: 12,

    },

    npayRowCon: {
        flexDirection: "row",
        alignItems: 'center',
        flex: 1

    }

})