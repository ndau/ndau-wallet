import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const ErrorIcon = ({ white = false }) => (
  <Svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clip-path="url(#clip0_74_3959)">
      <Path d="M10.0003 2.16602C5.40032 2.16602 1.66699 5.89518 1.66699 10.4993C1.66699 15.1035 5.40032 18.8327 10.0003 18.8327C14.6003 18.8327 18.3337 15.1035 18.3337 10.4993C18.3337 5.89518 14.6003 2.16602 10.0003 2.16602ZM10.8337 14.666H9.16699V12.9993H10.8337V14.666ZM10.8337 11.3327H9.16699V6.33268H10.8337V11.3327Z" fill="#E31C1C" />
    </G>
    <Defs>
      <ClipPath id="clip0_74_3959">
        <Rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
      </ClipPath>
    </Defs>
  </Svg>

);
export default ErrorIcon;


