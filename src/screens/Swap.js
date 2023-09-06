import {
    View, Text, StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    TextInput
} from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenContainer from '../components/Screen'
import Spacer from '../components/Spacer'
import CustomText from '../components/CustomText'
import { images } from '../../assets/images'
import { ArrowDownSVGComponent } from '../assets/svgs/components'
import { themeColors } from '../config/colors'
import { Swap as SwapIcon } from '../../assets/svgs/components'
import CustomTextInput from '../components/CustomTextInput'
import { ethers } from 'ethers'
import { EthersScanAPI } from '../helpers/EthersScanAPI'
import UserStore from "../stores/UserStore";

const Swap = (props) => {


    const [amountToSwap, setAmountToSwap] = useState('');
    const [swapResult, setSwapResult] = useState('');
    const provider = new ethers.providers.EtherscanProvider("homestead", EthersScanAPI.apiKey)
    const wallet =  new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey, provider)


    const token1Address = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';
    const token2Address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const token1Contract = new ethers.Contract(token1Address, ['function approve(address spender, uint256 amount)'],wallet);
    const token2Contract = new ethers.Contract(token2Address, ['function transferFrom(address sender, address recipient, uint256 amount)']);
  


    // const etherscanApiUrl = 'https://api.etherscan.io/rpc';

    // // Create a JsonRpcProvider that connects to the Etherscan API
    // const provider = new ethers.providers.JsonRpcProvider(etherscanApiUrl);
    console.log(JSON.stringify(provider, null, 2),'provider---')

    const handleSwap = async () => {
        try {

        
      
            setSwapResult(`Successfully swapped ${amountToSwap} Token 1 for Token 2.`);
        } catch (error) {
            console.error('Swap error:', error);
            setSwapResult('Error occurred during the swap.');
        }
    };



    return (
        <ScreenContainer headerTitle={"Swap"}>

            <Spacer height={20} />

            <CustomText bold body> Swap Your Tokens</CustomText>

            <Spacer height={20} />


            <View style={[styles.swapContainer1]}>


                <View style={styles.leftView}>
                    <CustomText>You Get</CustomText>

                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <Image style={styles.image} source={images.nDau} />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>NDAU</CustomText>
                        <Spacer width={2} />
                        <ArrowDownSVGComponent stroke={'black'} />
                    </View>


                </View>
                <Spacer height={20} />
                <View style={styles.rightView}>

                    <View style={styles.row}>
                        <TextInput style={styles.inputCon} placeholderTextColor={'#fff'} placeholder='0.0' >23.83</TextInput>
                        <Spacer width={4} />
                        <CustomText caption style={{ marginTop: 6 }}>$177.55</CustomText>
                    </View>
                    <View style={styles.row}>
                        <CustomText body2 >{`Bal   :`}</CustomText>
                        <Spacer width={10} />
                        <CustomText body2 >177.55</CustomText>
                    </View>
                </View>
            </View>

            <Spacer height={12} />

            <TouchableOpacity onPress={handleSwap} style={styles.svgView}>
                <SwapIcon />
            </TouchableOpacity>

            <Spacer height={12} />

            <View style={[styles.swapContainer2]}>
                <View style={styles.leftView}>
                    <CustomText>You Get</CustomText>

                    <View style={styles.selectCoin}>
                        <Spacer width={2} />
                        <Image style={styles.image} source={images.nDau} />
                        <Spacer width={2} />
                        <CustomText body2 color='black'>NDAU</CustomText>
                        <Spacer width={2} />
                        <ArrowDownSVGComponent stroke={'black'} />
                    </View>


                </View>
                <Spacer height={20} />
                <View style={styles.rightView}>

                    <View style={styles.row}>
                        <CustomText bold h6>90.83</CustomText>
                        <Spacer width={4} />
                        <CustomText caption style={{ marginTop: 6 }}>$177.55</CustomText>
                    </View>
                    <View style={styles.row}>
                        <CustomText body2 >{`Bal   :`}</CustomText>
                        <Spacer width={10} />
                        <CustomText body2 >22.55</CustomText>
                    </View>
                </View>
            </View>





        </ScreenContainer>
    )
}

export default Swap

const styles = StyleSheet.create({

    swapContainer1: {
        borderRadius: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        padding: 10,
        borderColor: 'white',
        borderWidth: 1

    },
    swapContainer2: {
        borderRadius: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        padding: 10,
        borderColor: 'white',
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
        width: 20,
        height: 20,
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

    }


})