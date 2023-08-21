import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import { themeColors } from '../config/colors';

export default function BottomSheetModal(props) {

    const {
        children = null,
        height = 0,
        modalStyle = {},
        refRBSheet = undefined,
        closeOnDragDown = true,
        closeOnPressMask = true,
        onModalClose = null,
    } = props;

    return (
        <RBSheet
            ref={refRBSheet}
            onClose={onModalClose}
            animationType="fade"
            height={height}
            closeOnDragDown={closeOnDragDown}
            closeOnPressMask={closeOnPressMask}
            dragFromTopOnly
            openDuration={300}
            keyboardAvoidingViewEnabled={true}
            customStyles={styles.rBSheetStyle}>
            <View style={[styles.lModalView, modalStyle]}>
                <>
                    <View style={styles.eachItem}>{children}</View>
                </>
            </View>
        </RBSheet>
    );
}

const styles = StyleSheet.create({

    lModalView: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopLeftRadius: Dimensions.get('window').width * 0.05,
        borderTopRightRadius: Dimensions.get('window').width * 0.05,
        backgroundColor: themeColors.black,
        overflow: 'hidden',
    },


    rBSheetStyle: {
        wrapper: {
            backgroundColor: 'rgba(2, 28, 33, 0.51)',
        },
        draggableIcon: {
            backgroundColor: themeColors.black,
            width: Dimensions.get('window').width * 0.2,
            height: Dimensions.get('window').height * 0.005,
        },
        container: {
            borderTopLeftRadius: Dimensions.get('window').width * 0.03,
            borderTopRightRadius: Dimensions.get('window').width * 0.03,
            overflow: 'hidden',
            backgroundColor: themeColors.black,
        },
    },
});
