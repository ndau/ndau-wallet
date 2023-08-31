import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SearchSVGComponent = (props) => (
    <Svg
        width={props.width ? props.width : 22}
        height={props.height ? props.height : 22}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6.90906 2.00195C5.93814 2.00195 4.98903 2.28986 4.18174 2.82928C3.37444 3.36869 2.74524 4.13538 2.37368 5.0324C2.00213 5.92941 1.90491 6.91646 2.09433 7.86873C2.28375 8.82099 2.75129 9.6957 3.43783 10.3822C4.12438 11.0688 4.99909 11.5363 5.95135 11.7258C6.90362 11.9152 7.89067 11.818 8.78768 11.4464C9.6847 11.0748 10.4514 10.4456 10.9908 9.63834C11.5302 8.83105 11.8181 7.88194 11.8181 6.91102C11.818 5.60908 11.3008 4.36049 10.3802 3.43988C9.45959 2.51927 8.211 2.00204 6.90906 2.00195Z"
            stroke="white"
            strokeMiterlimit={10}
        />
        <Path
            d="M10.5703 10.5723L13.9987 14.0007"
            stroke="white"
            strokeMiterlimit={10}
            strokeLinecap="round"
        />
    </Svg>
);
export default SearchSVGComponent;
