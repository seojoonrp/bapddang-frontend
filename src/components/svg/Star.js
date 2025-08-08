import React from "react";
import { Svg, Path } from "react-native-svg";

const Star = ({ width = 20, height = 20, fill = "white" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.2499 0H8.74989L6.89103 5.72101L0.87557 5.72102L0.103027 8.09866L4.96964 11.6344L3.11079 17.3554L5.13334 18.8249L9.9999 15.2891L14.8665 18.8249L16.889 17.3554L15.0301 11.6344L19.8968 8.09865L19.1241 5.72101H13.1088L11.2499 0Z"
        fill={fill}
      />
    </Svg>
  );
};

export default Star;
