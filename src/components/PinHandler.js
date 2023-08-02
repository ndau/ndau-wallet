import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const PinHandler = ({
	onPin,
	digits = 6, //by default 6 digits
}) => {

	const inputRefs = useRef({});

	const [data, setData] = useState([...Array(digits).fill('')]);

	const onChangeText = (t, index) => {
		setData(_ => {
			let arr = [..._]
			arr[index] = t;
			if (arr.filter(_ => _ !== '').length === digits) onPin(arr)
			return arr;
		});
		if (t && index < (digits - 1)) inputRefs.current[index + 1].focus()
		else if (t && index == digits - 1) inputRefs.current[index].blur();
		else if (index > 0) inputRefs.current[index - 1].focus()
	}

	return (
		<View style={styles.main}>
			{
				[...Array(digits)].map((_, index) => {
					return (
						<View style={styles.box} key={index}>
							<TextInput
								ref={r => inputRefs.current[index] = r}
								maxLength={1}
								style={styles.container}
								onChangeText={t => onChangeText(t, index)}
								secureTextEntry={true}
							/>
							<View style={styles.dash} />
						</View>
					)
				})
			}
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flexDirection: "row",
		justifyContent: "center",
		borderWidth: 1
	},
	container: {
		marginBottom: 10,
		textAlign: "center",
		color: themeColors.white,
		marginTop: 10,
		fontFamily: 'TitiliumWeb-Regular',
		fontSize: 24
	},
	dash: {
		borderWidth: 2,
		borderRadius: 10,
		borderColor: themeColors.white,
	},
	box: {
		width: 30,
		height: 54,
		marginHorizontal: 14
	},
	icon: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 5
	}
})

export default PinHandler;