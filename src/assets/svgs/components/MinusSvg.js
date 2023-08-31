import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Minus = (props) => (
    <Svg
        width={19}
        height={2}
        viewBox="0 0 19 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.5 1C0.5 0.801088 0.579018 0.610322 0.71967 0.46967C0.860322 0.329018 1.05109 0.25 1.25 0.25H17.75C17.9489 0.25 18.1397 0.329018 18.2803 0.46967C18.421 0.610322 18.5 0.801088 18.5 1C18.5 1.19891 18.421 1.38968 18.2803 1.53033C18.1397 1.67098 17.9489 1.75 17.75 1.75H1.25C1.05109 1.75 0.860322 1.67098 0.71967 1.53033C0.579018 1.38968 0.5 1.19891 0.5 1Z"
            fill="white"
        />
    </Svg>
);
export default Minus;
