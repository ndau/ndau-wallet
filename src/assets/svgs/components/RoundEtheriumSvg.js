import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";
const RoundEtheriumIcon = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={20} height={20} rx={10} fill="#E6E6E6" />
    <G clipPath="url(#clip0_4317_13401)">
      <Path
        d="M10.4984 4L10.4219 4.25979L10.4219 11.7976L10.4984 11.8739L13.9972 9.80566L10.4984 4Z"
        fill="#343434"
      />
      <Path
        d="M10.499 4L7 9.80566L10.499 11.8739L10.499 8.21524L10.499 4Z"
        fill="#8C8C8C"
      />
      <Path
        d="M10.4962 12.5359L10.4531 12.5885L10.4531 15.2735L10.4962 15.3994L13.9973 10.4687L10.4962 12.5359Z"
        fill="#3C3C3B"
      />
      <Path
        d="M10.499 15.3994L10.499 12.5359L7 10.4688L10.499 15.3994Z"
        fill="#8C8C8C"
      />
      <Path
        d="M10.5 11.8735L13.9989 9.80525L10.5 8.21484L10.5 11.8735Z"
        fill="#141414"
      />
      <Path
        d="M7 9.80525L10.499 11.8735L10.499 8.21484L7 9.80525Z"
        fill="#393939"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4317_13401">
        <Rect
          width={7}
          height={11.3999}
          fill="white"
          transform="translate(7 4)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default RoundEtheriumIcon;
