import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { themeColors } from "../config/colors";
import CustomText from "./CustomText";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { ErrorIcon, SuccessIcon } from "../assets/svgs/components";

const PinHandler = ({
	label,
	onPin,
	autoFocus = false,
	digits = 6, //by default 6 digits
	errors = [],
	success = [],
	bridge
}) => {

	const inputRefs = useRef({});
	const [data, setData] = useState([...Array(digits).fill('')]);

	const onChangeText = (t, index) => {

		// only numeric data
		if (t?.charCodeAt(0) >= 48 && t?.charCodeAt(0) <= 57 || t === "") {
			setData(_ => {
				let arr = [..._]
				arr[index] = t;
				return arr;
			});
			if (t && index < (digits - 1)) inputRefs.current[index + 1].focus()
			else if (t && index == digits - 1) inputRefs.current[index].blur();
			else if (index > 0) inputRefs.current[index - 1].focus()
		}
	}

	useEffect(() => {
		if (data.filter(_ => _ !== '').length === digits) onPin(data.join(''))
	}, [data])

	useEffect(() => {
		autoFocus && inputRefs.current?.[0].focus();
		if (bridge) bridge.current = innerBirdge
	}, [])

	const innerBirdge = ({ focus }) => {
		if (typeof focus === "boolean" && focus) {
			inputRefs.current?.[0].focus();
		}
	}

	const RenderMsg = useCallback(({ msg, isError }) => {
		return (
			<View style={styles.msgBox}>
				{isError ? <ErrorIcon /> : <SuccessIcon />}
				<CustomText style={{ marginLeft: 4 }}>{msg}</CustomText>
			</View>
		)
	}, [errors, success])

	return (
		<View style={styles.mainBox}>
			<CustomText titiliumSemiBold body2 style={styles.textAlign}>{label}</CustomText>
			<View style={styles.main}>
				{
					data.map((_, index) => {
						return (
							<View style={styles.box} key={index}>
								<TextInput
									ref={r => inputRefs.current[index] = r}
									maxLength={1}
									value={data[index]}
									keyboardType="numeric"
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
			{errors.map(msg => <RenderMsg key={msg} msg={msg} isError />)}
			{success.map(msg => <RenderMsg key={msg} msg={msg} />)}
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	mainBox: {
		marginBottom: 20
	},
	container: {
		// marginBottom: 10,
		textAlign: "center",
		color: themeColors.white,
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
		marginHorizontal: 8,
	},
	icon: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 5
	},
	textAlign: {
		marginBottom: 10,
		textAlign: "center"
	},
	msgBox: {
		marginTop: 12,
		flexDirection: "row",
		alignItems: "center"
	},
	icon: {
		height: 10,
		width: 10,
		borderRadius: 5,
		marginRight: 5
	}
})

export default PinHandler;