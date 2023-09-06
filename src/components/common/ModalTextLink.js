import { Linking, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomText from '../CustomText';

const ModalTextLink = (props) => {
    return (
        <TouchableOpacity onPress={() => Linking.openURL(props.url)} activeOpacity={0.7}>
            <CustomText body2 color='white' style={{ textAlign: 'center' }}>
                Read more about fees
            </CustomText>
        </TouchableOpacity>
    );
}

export default ModalTextLink

