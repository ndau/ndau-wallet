import * as React from "react";
import Svg, { Path } from "react-native-svg";
const AlreadyHaveWalletSVGComponent = (props) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8 11.5059H11V21.5059H13V11.5059H16L12 7.50586L8 11.5059ZM4 3.50586V5.50586H20V3.50586H4Z"
      fill="white"
    />
  </Svg>
);
export default AlreadyHaveWalletSVGComponent;
