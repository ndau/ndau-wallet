import * as React from "react";
import Svg, { Path } from "react-native-svg";

const NdauLogoSVGComponent = (props) => (

    <Svg
        width={props.width ? props.width : 22}
        height={props.height ? props.height : 31}
        viewBox="0 0 22 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M21.1341 30.5009V26.752H0.996094V30.5009H21.1428H21.1341Z"
            fill="white"
        />
        <Path
            d="M17.3828 21.9046V9.51495C17.3828 8.11235 16.7075 6.8223 15.6252 5.87858C14.4737 4.87425 12.8721 4.25087 11.0799 4.25087C9.28773 4.25087 7.68604 4.87425 6.53455 5.87858C5.45232 6.8223 4.77702 8.11235 4.77702 9.51495V21.9046H1.01953V9.51495C1.01953 6.98681 2.18833 4.70975 4.06708 3.06472C5.87656 1.48031 8.36134 0.501953 11.0712 0.501953C13.7811 0.501953 16.2659 1.48031 18.0754 3.06472C19.9541 4.70975 21.1229 6.98681 21.1229 9.51495V21.9046H17.3655H17.3828Z"
            fill="white"
        />
    </Svg>
);
export default NdauLogoSVGComponent;
