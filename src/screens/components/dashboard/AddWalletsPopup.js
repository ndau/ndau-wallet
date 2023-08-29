import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { ArrowDownSVGComponent, BlockChainWalletLogoSVGComponent } from '../../../assets/svgs/components';
import CustomText from '../../../components/CustomText';
import { addWalletsData } from '../../../utils';
import DashBoardBottomSheetCard from '../DashBoardBottomSheetCard';
import Spacer from '../../../components/Spacer';

const AddWalletsPopup = ({ onItemClick,onClose}) => {
    return (
        <View>
            <View style={styles.modal}>
                <CustomText bold body>Wallet</CustomText>
                <TouchableOpacity onPress={onClose}>
                    <ArrowDownSVGComponent />
                </TouchableOpacity>
            </View>
            <Spacer height={12} />
            <View style={styles.divider} />
            <Spacer height={30} />

            <View style={styles.svgContainer}>
                <BlockChainWalletLogoSVGComponent />
            </View>
            <Spacer height={25} />
            <View style={styles.modalCardContainer}>
                {
                    addWalletsData.map((item, index) => {
                        return (
                            <DashBoardBottomSheetCard
                                key={index}
                                rightSvg={item.svg}
                                label={item.label}
                                title={item.title}
                                onPress={()=>onItemClick(index)}
                            

                            />
                        )
                    })
                }
            </View>

        </View>
    )
}

export default AddWalletsPopup

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: "#484848"
    },
    modal: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        width: Dimensions.get('window').width,
        justifyContent: 'space-between'
    },
    svgContainer: {
        alignSelf: 'center'
    },
    modalCardContainer: {
        paddingHorizontal: 16
    }
})