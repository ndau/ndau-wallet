import * as React from "react";
import Svg, { G, Path, Rect, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const NdauAccountLogoSVGComponent = (props) => (
    <Svg
        width={props.width?props.width:80}
        height={props.height?props.height:80}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G filter="url(#filter0_b_2812_18628)">
            <Path
                d="M51.9858 57.7394V53.2734H27.9961V57.7394H51.9961H51.9858Z"
                fill="white"
            />
            <Path
                d="M47.5163 47.4981V32.7388C47.5163 31.0679 46.7119 29.5311 45.4227 28.4069C44.0509 27.2105 42.1429 26.4679 40.008 26.4679C37.873 26.4679 35.965 27.2105 34.5933 28.4069C33.3041 29.5311 32.4996 31.0679 32.4996 32.7388V47.4981H28.0234V32.7388C28.0234 29.7271 29.4158 27.0145 31.6539 25.0549C33.8094 23.1674 36.7695 22.002 39.9977 22.002C43.2258 22.002 46.1859 23.1674 48.3414 25.0549C50.5795 27.0145 51.9719 29.7271 51.9719 32.7388V47.4981H47.4957H47.5163Z"
                fill="white"
            />
            <Rect x={0.5} y={0.5} width={79} height={79} rx={17.5} stroke="#F7941D" />
        </G>
        <Defs></Defs>
    </Svg>
);
export default NdauAccountLogoSVGComponent;
