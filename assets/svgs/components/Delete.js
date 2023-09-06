import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const Delete = ({ width = 17, height = 17 }) => (
  <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clip-path="url(#clip0_2967_20655)">
      <Path d="M6.5 19C6.5 20.105 7.395 21 8.5 21H16.5C17.605 21 18.5 20.105 18.5 19V7H6.5V19ZM19.5 4H16L15 3H10L9 4H5.5V6H19.5V4Z" fill="white" />
    </G>
    <Defs>
      <ClipPath id="clip0_2967_20655">
        <Rect width="24" height="24" fill="white" transform="translate(0.5)" />
      </ClipPath>
    </Defs>
  </Svg>

);
export default Delete;


