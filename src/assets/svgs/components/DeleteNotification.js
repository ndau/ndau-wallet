import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";

const NotificationDelete = (props) => (

  <Svg
    width={props.width ? props.width : 32}
    height={props.height ? props.height : 32}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={48} height={48} rx={24} fill="#E31C1C" />
    <G clipPath="url(#clip0_163_4443)">
      <Path
        d="M18 31C18 32.105 18.895 33 20 33H28C29.105 33 30 32.105 30 31V19H18V31ZM31 16H27.5L26.5 15H21.5L20.5 16H17V18H31V16Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_163_4443">
        <Rect
          width={24}
          height={24}
          fill="white"
          transform="translate(12 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default NotificationDelete;
