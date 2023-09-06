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


const Swap = (props) => {

    const [token1, setToken1] = useState({balance:'12.34',coinType:'ndau'});
    const [token2, setToken2] = useState('Token B');


    const toggleViews = () => {

        const tempToken = token1;
        setToken1(token2);
        setToken2(tempToken);

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

            <TouchableOpacity onPress={toggleViews} style={styles.svgView}>
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
    inputCon:{
         color:themeColors.white,
         fontWeight:"bold",
         fontSize:18,
         
    }


})