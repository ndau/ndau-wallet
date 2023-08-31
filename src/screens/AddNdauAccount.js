import { View, Text, StyleSheet, FlatList } from 'react-native'
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
import UserStore from "../stores/UserStore";

const AddNdauAccount = (props) => {
    const { item } = props?.route?.params ?? {};
    const paramItem = item;

    const modalRef = useRef(null);
    const modelNdauFeeRef = useRef(null);
    const [noOfAccounts, setNoOfAccounts] = useState(1)
    const { getNDauAccounts, addAccountsInNdau } = useWallet();
    const [nDauAccounts, setNDauAccounts] = useState(getNDauAccounts());
    const [loading, setLoading] = useState("");
    const increment = () => setNoOfAccounts(noOfAccounts + 1)
    const [searchQuery, setSearchQuery] = useState("");



    const decremnet = () => {
        if (noOfAccounts > 1)
            return setNoOfAccounts(noOfAccounts - 1)
    }
    const addAccounts = async () => {
        modalRef.current(false);
        setLoading("Creating Account")
        addAccountsInNdau(noOfAccounts).then((res) => {
            setLoading("")
            modelNdauFeeRef.current(true)
            setNDauAccounts([...getNDauAccounts()]);
        });
        setNoOfAccounts(1);
    };

    console.log(JSON.stringify(UserStore),'ndayaccount---')

    return (
        <ScreenContainer>
            {loading && <Loading label={loading} />}
            <Spacer height={16} />
            <NdauAddAccounHeaderCard
                totalBalance={item.totalFunds}
                convertBalance={item.usdAmount}
                addAccountPress={() => {
                    modalRef.current(true)
                }}
                totalAccounts={getNDauAccounts()}

            />
            <Spacer height={20} />
            <Search
                placeholder={"Search for account name or wallet address..."}
                onChangeText={(query) => setSearchQuery(query)}
            />
            <Spacer height={25} />
            <FlatList
                // data={nDauAccounts}
                data={nDauAccounts.filter((account) => {
                    let name = account?.addressData?.nickname?.toLowerCase();
                    let address = account?.address?.toLowerCase();
                    const query = searchQuery.toLowerCase();
                    return name.includes(query) || address.includes(query);
                })}
                renderItem={({ item, index }) =>
                    <AccountItemCard
                        key={index}
                        item={item}
                        index={index}
                        onItemClick={(val) => props.navigation.navigate(ScreenNames.NDAUDetail, { item: { ...val, ...paramItem } })}
                    />}
                keyExtractor={(item, index) => index.toString()}
            />

            <CustomModal bridge={modalRef}>
                <AddAccountPopupCard
                    val={noOfAccounts}
                    addAccount={addAccounts}
                    increment={increment}
                    decrement={decremnet}
                    onCancel={() => {
                        modalRef.current(false)
                    }}
                />
            </CustomModal>

            <CustomModal bridge={modelNdauFeeRef}>
                <NdauAccountFeeCard
                    onUnderstand={() => modelNdauFeeRef.current(false)}
                    onCancel={() => modelNdauFeeRef.current(false)}
                />
            </CustomModal>


        </ScreenContainer>
    )
}

export default AddNdauAccount

const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: themeColors.black
    }

})