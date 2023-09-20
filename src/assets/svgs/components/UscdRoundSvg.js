import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const RoundUsdcIcon = (props) => (
    <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={20} height={20} rx={10} fill="#2775CA" />
        <Path
            d="M13 11.9849C13 10.4178 12.0597 9.88051 10.1791 9.65667C8.8358 9.47753 8.56714 9.11937 8.56714 8.49245C8.56714 7.86553 9.01494 7.46266 9.91043 7.46266C10.7164 7.46266 11.1642 7.73131 11.388 8.40293C11.4329 8.53726 11.5672 8.62677 11.7015 8.62677L12.4179 8.62677C12.597 8.62677 12.7313 8.49245 12.7313 8.31342V8.26861C12.5522 7.28352 11.7462 6.52238 10.7164 6.43287L10.7164 5.35827C10.7164 5.17914 10.5821 5.04481 10.3582 5L9.68658 5C9.50744 5 9.37311 5.13432 9.3283 5.35827L9.3283 6.38806C7.98501 6.56719 7.13433 7.46266 7.13433 8.58207C7.13433 10.0596 8.02982 10.6416 9.91043 10.8656C11.1642 11.0894 11.5672 11.3581 11.5672 12.0745C11.5672 12.7909 10.9403 13.2834 10.0896 13.2834C8.92531 13.2834 8.52233 12.7908 8.388 12.1192C8.34329 11.9402 8.20896 11.8506 8.07463 11.8506L7.31336 11.8506C7.13433 11.8506 7 11.9849 7 12.164V12.2088C7.17903 13.3281 7.89549 14.1341 9.37311 14.358L9.37311 15.4326C9.37311 15.6117 9.50744 15.746 9.73129 15.7908L10.4029 15.7908C10.5821 15.7908 10.7164 15.6565 10.7612 15.4326L10.7612 14.358C12.1045 14.1341 13 13.1938 13 11.9849Z"
            fill="white"
        />
    </Svg>
);
export default RoundUsdcIcon;
