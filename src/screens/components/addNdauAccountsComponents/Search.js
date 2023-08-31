import { View, Text, StyleSheet, TextInput, Platform } from 'react-native'
import React from 'react'
import { themeColors } from '../../../config/colors'
import SearchSVGComponent from '../../../assets/svgs/components/searchSvg'

const Search = ({ value, maxLength, placeholder, onChangeText, secureTextEntry }) => {
    return (
        <View style={styles.container}>

            <TextInput
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
                placeholderTextColor={themeColors.white}
                style={styles.inputContainer}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
            <View style={styles.seachSvg}>
                <SearchSVGComponent />
            </View>

        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        borderColor: themeColors.white,
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: themeColors.white,
        alignItems: 'center',
        padding: Platform.OS === 'ios' && 10,
    },
    inputContainer: {
        color: themeColors.white,
        width: 250
    },
    seachSvg: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})