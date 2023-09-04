import * as React from "react";
import Svg, { Path } from "react-native-svg";

const QRCode = ({ white = false }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3 11.25V3H11.25V11.25H3ZM4.5 9.75H9.75V4.5H4.5V9.75ZM3 21V12.75H11.25V21H3ZM4.5 19.5H9.75V14.25H4.5V19.5ZM12.75 11.25V3H21V11.25H12.75ZM14.25 9.75H19.5V4.5H14.25V9.75ZM18.95 21V18.95H21V21H18.95ZM12.75 14.825V12.75H14.8V14.825H12.75ZM14.8 16.875V14.825H16.875V16.875H14.8ZM12.75 18.95V16.875H14.8V18.95H12.75ZM14.8 21V18.95H16.875V21H14.8ZM16.875 18.95V16.875H18.95V18.95H16.875ZM16.875 14.825V12.75H18.95V14.825H16.875ZM18.95 16.875V14.825H21V16.875H18.95Z" fill="white" />
  </Svg>
);
export default QRCode;


