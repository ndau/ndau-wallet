import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import Modal from "react-native-modal";

import { images } from "../assets/images";
import { themeColors } from "../config/colors";

const ModalImage = () => {
	return (
		<Image source={images.EmptyState} />
	)
}

const CustomModal = ({ bridge, children, canIgnore = false }) => {
	const [isModalVisible, setModalVisible] = useState(false);

	const innerBridge = (value) => {
		setModalVisible(value);
	}

	const hideModal = () => {
		setModalVisible(false);
	}

	useEffect(() => {
		if (bridge) bridge.current = innerBridge
	}, [])

	return (
		<Modal
			onBackButtonPress={canIgnore ? hideModal : undefined}
			onBackdropPress={canIgnore ? hideModal : undefined}
			backdropOpacity={.9}
			isVisible={isModalVisible}
		>
			<View style={styles.modalContainer}>
				{children}
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		padding: 24,
		borderRadius: 20,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.white,
		backgroundColor: themeColors.applyOpacityOn(themeColors.modalBackground, 'bb')
	}
})

export { ModalImage }
export default CustomModal;