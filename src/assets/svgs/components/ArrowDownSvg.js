import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ArrowDownSVGComponent = (props) => (
  <Svg
    width={12}
    height={9}
    viewBox="0 0 12 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1.41 0.794922L6 5.37492L10.59 0.794922L12 2.20492L6 8.20492L0 2.20492L1.41 0.794922Z"
      fill={props.stroke ? props.stroke : "white"}
    />
  </Svg>
);
export default ArrowDownSVGComponent;
