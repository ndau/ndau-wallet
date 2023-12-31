import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import CustomText from "../CustomText";
import { themeColors } from "../../config/colors";

const FlashNotification = {
  show: (message, long = false) => {
    global.flashMessageRef(message, long);
  }
}

const FlashMessage = ({ }) => {

  const animValue = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(animValue.value, [0, 1], [-100, 70]) }],
      opacity: interpolate(animValue.value, [0, 1], [0, 1]),
    }
  })
  const [text, setText] = useState("");

  const show = (message, long) => {
    setText(message);
    animValue.value = withTiming(1, { duration: 500 });
    setTimeout(() => {
      animValue.value = withTiming(0, { duration: 500 });
      setTimeout(() => setText(""), 1000);
    }, long ? 4000 : 2000);
  }

  useEffect(() => {
    global.flashMessageRef = show
  }, [])

  return !!text && (
    <Animated.View style={[styles.container, animStyle]}>
      <CustomText titiliumSemiBold>{text}</CustomText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // top: 60,
    padding: 10,
    left: 10,
    right: 10,
    backgroundColor: themeColors.dangerFlashBackground,
    borderRadius: 10
  }
})

export {
  FlashMessage
}

export default FlashNotification;