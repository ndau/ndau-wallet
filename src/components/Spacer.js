import React from "react";
import { View } from "react-native";

function Spacer(props) {
  const { width, height } = props;

  return (
    <View
      style={{
        width,
        height,
      }}
    />
  );
}

Spacer.defaultProps = {
  width: 0,
  height: 0,
};

export default Spacer;
