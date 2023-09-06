import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ArrowRightSVGComponent = (props) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 4.50586L10.59 5.91586L16.17 11.5059H4V13.5059H16.17L10.59 19.0959L12 20.5059L20 12.5059L12 4.50586Z"
      fill="white"
    />
  </Svg>
);
export default ArrowRightSVGComponent;
