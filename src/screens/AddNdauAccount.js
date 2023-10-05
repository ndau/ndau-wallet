import { StyleSheet, FlatList, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import ScreenContainer from '../components/Screen'
import { themeColors } from '../config/colors'
import NdauAddAccounHeaderCard from './components/addNdauAccountsComponents/NdauAddAccounHeaderCard'
import Spacer from '../components/Spacer'
import Search from './components/addNdauAccountsComponents/Search'
import AddAccountPopupCard from './components/addNdauAccountsComponents/AddAccountPopupCard'
import CustomModal from '../components/Modal'
import { useWallet } from '../hooks'
import AccountItemCard from './components/addNdauAccountsComponents/AccountIemCard'
import Loading from '../components/Loading'
import { ScreenNames } from './ScreenNames'
import NdauAccountFeeCard from './components/addNdauAccountsComponents/NdauAccountFeeCard'
import { useIsFocused } from '@react-navigation/native'
import FlashNotification from '../components/common/FlashNotification'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import CustomText from '../components/CustomText'

const AddNdauAccount = (props) => {
    const { item, onSelectAccount, addAccount } = props?.route?.params ?? {};
    const paramItem = item;

    const anim = useSharedValue(0);

    const isFocused = useIsFocused();
    const { getNdauAccountsDetails } = useWallet();

    const modalRef = useRef(null);
    const modelNdauFeeRef = useRef(null);
    const [noOfAccounts, setNoOfAccounts] = useState(1)
    const { getNDauAccounts, addAccountsInNdau } = useWallet();
    const [nDauAccounts, setNDauAccounts] = useState(getNDauAccounts());
    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");
    const increment = () => setNoOfAccounts(noOfAccounts + 1)
    const [searchQuery, setSearchQuery] = useState("");
    const [createdAccount, setAccountCreated] = useState(null);
    const [totalFunds, setTotalFunds] = useState(paramItem.totalFunds);
    const [totalUSDAmount, setTotalUSDAmount] = useState(paramItem.usdAmount);

    useEffect(() => {
        if (addAccount) {
            modelNdauFeeRef.current(true);
        }
    }, [])

    useEffect(() => {
        if (isFocused) {
            refreshDetails();
        }
    }, [isFocused])


    const decremnet = () => {
        if (noOfAccounts > 1)
            return setNoOfAccounts(noOfAccounts - 1)
    }

    const showMessage = (msg) => {
        setMessage(msg);
        anim.value = withTiming(1, { duration: 500 });
        setTimeout(() => {
            anim.value = withTiming(0, { duration: 500 });
        }, 2000);
    }

    const boxStyle = useAnimatedStyle(() => ({
        opacity: anim.value
    }), [])

    const addAccounts = () => {
        modelNdauFeeRef.current(false)
        setLoading("Creating Account")
        addAccountsInNdau(noOfAccounts).then((res) => {
            setLoading("")
            refreshDetails();
        });
        setNoOfAccounts(1);
    };

    const renderCreatedAccount = () => {
        if (!createdAccount) return null;
        return (
            <View>
                <AccountItemCard
                    item={createdAccount}
                    onItemClick={(val) => {
                        if (onSelectAccount) {
                            onSelectAccount(val);
                            return props.navigation.goBack();
                        }
                    }}
                />
                <View style={styles.line} />
            </View>
        )
    }

    const refreshDetails = () => {
        getNdauAccountsDetails().then(() => {
            const obj = getNDauAccounts().reduce((prev, curr) => {
                return {
                    totalFunds: prev.totalFunds += parseFloat(curr.totalFunds || 0),
                    usdAmount: prev.usdAmount += parseFloat(curr.usdAmount || 0)
                }
            }, { totalFunds: 0, usdAmount: 0 })
            setTotalUSDAmount(obj.usdAmount);
            setTotalFunds(obj.totalFunds);
            setNDauAccounts([...getNDauAccounts()])
        });
    }


    return (
        <ScreenContainer>
            {loading && <Loading label={loading} />}
            <Spacer height={16} />
            <NdauAddAccounHeaderCard
                totalBalance={parseFloat(totalFunds || 0).toFixed(4)}
                convertBalance={parseFloat(totalUSDAmount || 0).toFixed(4)}
                addAccountPress={() => {
                    modalRef.current(true)
                }}
                totalAccounts={getNDauAccounts()}
            />
            <Spacer height={20} />
            <View style={styles.divider} />
            <Spacer height={20} />
            <Search
                placeholder={"Search for account name or wallet address..."}
                onChangeText={(query) => setSearchQuery(query)}
            />
            <Spacer height={25} />
            <FlatList
                data={nDauAccounts.filter((account) => {
                    let name = account?.addressData?.nickname?.toLowerCase();
                    let address = account?.address?.toLowerCase();
                    const query = searchQuery.toLowerCase();
                    return name?.includes(query) || address?.includes(query);
                })}
                ListHeaderComponent={renderCreatedAccount()}
                renderItem={({ item, index }) => {
                    if (createdAccount?.address === item.address) return null;
                    return <AccountItemCard
                        key={index}
                        disabled={
                            paramItem.address === item.address ||
                            (
                                !!onSelectAccount &&
                                (
                                    !!item.addressData?.lock?.unlocksOn ||
                                    !!item.addressData.rewardsTarget
                                )
                            )
                        }
                        item={item}
                        index={index}
                        onItemClick={(val) => {
                            if (onSelectAccount) {
                                onSelectAccount(val);
                                return props.navigation.goBack();
                            }
                            props.navigation.navigate(ScreenNames.NDAUDetail, { item: { image: paramItem.image, name: val?.addressData?.nickname, tokenName: 'ndau', ...val } })
                        }}
                    />
                }}
                keyExtractor={(item, index) => index.toString()}
            />

            <CustomModal bridge={modalRef}>
                <AddAccountPopupCard
                    val={noOfAccounts}
                    addAccount={() => {
                        modalRef.current(false)
                        setTimeout(() => {
                            modelNdauFeeRef.current(true)
                        }, 500)
                    }}
                    increment={increment}
                    decrement={decremnet}
                    onCancel={() => {
                        modalRef.current(false)
                        setNoOfAccounts(1);
                    }}
                />
            </CustomModal>

            <CustomModal bridge={modelNdauFeeRef}>
                <NdauAccountFeeCard
                    onUnderstand={() => {

                        if (addAccount) {
                            modelNdauFeeRef.current(false)
                            setLoading("Creating account");
                            addAccountsInNdau().then((res) => {
                                setLoading("")
                                refreshDetails();
                                const account = getNDauAccounts().at(-1);
                                setAccountCreated(account);
                                showMessage(account.addressData?.nickname + " has been created");
                            }).catch(err => {
                                setLoading("");
                                FlashNotification.show(err.message, true)
                            });
                        }
                        else {

                            console.log('account')
                            addAccounts()
                        }
                    }}
                    onCancel={() => {
                        
                        modelNdauFeeRef.current(false);
                        if (addAccount) {
                            props.navigation.goBack();
                        }
                   
                    }}

                    isCancel={true}
                />
            </CustomModal>

            {
                message && (
                    <Animated.View style={[styles.animatedViewContainer, boxStyle]}>
                        <View style={styles.message}>
                            <CustomText titiliumSemiBold>{message}</CustomText>
                        </View>
                    </Animated.View>
                )
            }
        </ScreenContainer>
    )
}

export default AddNdauAccount

const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: themeColors.black
    },
    animatedViewContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
    },
    message: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: themeColors.warning500
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.white,
        marginVertical: 10,
        width: "98%",
        alignSelf: "center",
    },
    divider: {
        height: .5,
        backgroundColor: "#808080",
        opacity: .5
    }
})