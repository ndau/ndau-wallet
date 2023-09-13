import * as React from "react";
import Svg, { Path, ClipPath, G, Rect, Defs } from "react-native-svg";
import { themeColors } from "../../../config/colors";

const EnvironmentIcon = ({ }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clip-path="url(#clip0_233_3631)">
      <Path d="M12 21V13.5M21 12H13.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M21 3H12C7.02945 3 3 7.02945 3 12V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </G>
    <Defs>
      <ClipPath id="clip0_233_3631">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default EnvironmentIcon;


