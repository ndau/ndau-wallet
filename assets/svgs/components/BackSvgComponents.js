import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BackSVGComponent = (props) => (
  <Svg
    width={props.width ? props.width : 18}
    height={props.height ? props.height : 10}
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5.30959 9.37235C5.42599 9.25525 5.49133 9.09684 5.49133 8.93172C5.49133 8.76661 5.42599 8.6082 5.30959 8.4911L2.43459 5.62235H17.1533C17.3191 5.62235 17.4781 5.5565 17.5953 5.43929C17.7125 5.32208 17.7783 5.16311 17.7783 4.99735C17.7783 4.83159 17.7125 4.67262 17.5953 4.55541C17.4781 4.4382 17.3191 4.37235 17.1533 4.37235H2.45334L5.30959 1.5161C5.4281 1.39841 5.49502 1.23846 5.4956 1.07143C5.49619 0.904409 5.4304 0.743993 5.31271 0.625474C5.19502 0.506956 5.03507 0.440043 4.86805 0.439457C4.70102 0.438871 4.5406 0.504659 4.42209 0.622349L0.447085 4.6036C0.342128 4.70902 0.283203 4.85172 0.283203 5.00047C0.283203 5.14923 0.342128 5.29193 0.447085 5.39735L4.42209 9.37235C4.48019 9.43093 4.54931 9.47743 4.62548 9.50916C4.70164 9.54089 4.78333 9.55722 4.86584 9.55722C4.94834 9.55722 5.03003 9.54089 5.1062 9.50916C5.18236 9.47743 5.25148 9.43093 5.30959 9.37235Z"
      fill="white"
    />
  </Svg>
);
export default BackSVGComponent;
