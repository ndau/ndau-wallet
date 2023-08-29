import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenContainer from '../components/Screen'
import { themeColors } from '../config/colors'
import NdauAddAccounHeaderCard from './components/addNdauAccountsComponents/NdauAddAccounHeaderCard'
import Spacer from '../components/Spacer'
import AccountIemCard from './components/addNdauAccountsComponents/AccountIemCard'
import Search from './components/addNdauAccountsComponents/Search'
import AddAccountPopupCard from './components/addNdauAccountsComponents/AddAccountPopupCard'
import CustomModal from '../components/Modal'

const AddNdauAccount = (props) => {
    const modalRef = useRef(null);
    const [noOfAccounts, setNoOfAccounts] = useState(0)


    const increment = () => setNoOfAccounts(noOfAccounts + 1)

    const decremnet = () => {
        if (noOfAccounts > 0)
            return setNoOfAccounts(noOfAccounts - 1)
    }
    const addAccounts = () => {
        modalRef.current(false)
    }

    return (
        <ScreenContainer>

            <Spacer height={16} />

            <NdauAddAccounHeaderCard
                addAccountPress={() => {
                    modalRef.current(true)
                }}

            />
            <Spacer height={20} />
            <Search
                placeholder={"Search for account name or wallet address..."}
            />
            <Spacer height={25} />
            <FlatList
                data={[0, 1, 2, 3, 4]}
                renderItem={({ item, index }) => <AccountIemCard />}
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


        </ScreenContainer>
    )
}

export default AddNdauAccount

const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: themeColors.black
    }

})