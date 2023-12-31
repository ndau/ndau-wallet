import * as React from "react";
import Svg, { Path } from "react-native-svg";

const WalletIcon = ({ white = false }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M20.5 18V19C20.5 20.1 19.6 21 18.5 21H4.5C3.39 21 2.5 20.1 2.5 19V5C2.5 3.9 3.39 3 4.5 3H18.5C19.6 3 20.5 3.9 20.5 5V6H11.5C10.39 6 9.5 6.9 9.5 8V16C9.5 17.1 10.39 18 11.5 18H20.5ZM11.5 16H21.5V8H11.5V16ZM15.5 13.5C14.67 13.5 14 12.83 14 12C14 11.17 14.67 10.5 15.5 10.5C16.33 10.5 17 11.17 17 12C17 12.83 16.33 13.5 15.5 13.5Z" fill="white" />
  </Svg>
);
export default WalletIcon;


