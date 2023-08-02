import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';

import Animated from "react-native-reanimated";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import Button from "./Button";

const PhraseHandler = ({
	label,
	placeholder,
	onChangeText,
	maxLength = 50, //by default 50 characters
	errors = [],
	success = []
}) => {

	const lastKeyEventTimestamp = useRef(0);
	const [currentValue, setCurrentValue] = useState("");
	const [phrases, setPhrases] = useState([])

	const RenderMsg = useCallback(({ msg, isError }) => {
		return (
			<Animated.View style={styles.msgBox}>
				<View style={[styles.icon, { backgroundColor: isError ? themeColors.error : themeColors.success }]} />
				<CustomText>{msg}</CustomText>
			</Animated.View>
		)
	}, [errors, success])

	const handleEnteringPhrase = (t) => {
		if (t.length === 1 && t == " ") return;
		setCurrentValue(t);
		const isSpace = t.at(-1) === " ";
		if (isSpace) {
			setPhrases(_ => {
				const phr = [..._];
				phr.push(t.split(" ")[0])
				return phr;
			})
			setCurrentValue("")
		}
	}

	const renderPhrase = (phrase, index) => {
		return (
			<View key={index} style={styles.capsule}>
				<CustomText>{phrase}</CustomText>
			</View>
		)
	}

	return (
		<>
			<View style={styles.main}>
				<CustomText body titilium>{label}</CustomText>
				<View style={styles.container}>
					{phrases.map(renderPhrase)}
					<TextInput
						value={currentValue}
						maxLength={maxLength}
						placeholder={placeholder}
						style={{ color: themeColors.font }}
						placeholderTextColor={themeColors.fontLight}
						onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Backspace') {
								if (Math.abs(lastKeyEventTimestamp.current - e.timeStamp) < 20) return;
								if (!currentValue?.length) setCurrentValue(phrases.pop())
							} else {
								lastKeyEventTimestamp.current = e.timeStamp;
							}
						}}
						onChangeText={handleEnteringPhrase}
					/>
				</View>
				{errors.map(msg => <RenderMsg key={msg} msg={msg} isError />)}
				{success.map(msg => <RenderMsg key={msg} msg={msg} />)}
			</View>
			<Button
				label={"Paste Secret Phrase"}
				buttonContainerStyle={styles.outlineButton}
				onPress={() => {
					Clipboard.getString().then(res => {
						const words = res.split(' ');
						if (words.length > 12) return;
						setPhrases(words.map(word => word.trim().replaceAll('\n', '')))
					})
				}}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	main: {
		marginVertical: 10
	},
	container: {
		height: 204,
		padding: 20,
		borderRadius: 30,
		// justifyContent: "center",
		// alignItems: "center",
		borderWidth: 1,
		borderColor: themeColors.white,
		color: themeColors.white,
		marginTop: 10,
		fontFamily: 'TitiliumWeb-Regular',
		flexDirection: "row",
		flexWrap: "wrap"
	},
	msgBox: {
		marginTop: 10,
		marginLeft: 4,
		flexDirection: "row",
		alignItems: "center"
	},
	icon: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 5
	},
	capsule: {
		padding: 10,
		borderRadius: 20,
		marginRight: 6,
		marginBottom: 6,
		backgroundColor: themeColors.primary
	},
	outlineButton: {
		backgroundColor: undefined,
		borderWidth: 2,
		borderColor: themeColors.primary
	},
})

export default PhraseHandler;