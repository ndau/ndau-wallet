import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const StateButton = ({ states = [], onButtonPress, resetToPrevious }) => {
	const [stateIndex, setStateIndex] = useState(0);
	const timeoutId = useRef(null);

	const onPress = () => {
		if (stateIndex < states.length - 1) setStateIndex(_ => ++_);
		onButtonPress?.();

		if (resetToPrevious) {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			timeoutId.current = setTimeout(() => setStateIndex(0), 2000);
		}
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}>
			{states[stateIndex]}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({

})

export default StateButton;