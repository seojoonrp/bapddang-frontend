import React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

const Star = ({ width = 24, height = 25, fill = "white", stroke = "#521210" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G clipPath="url(#clip0)">
      <Path
        d="M13.1362 1L15.2544 7.51953L15.3667 7.86523H22.5854L23.2876 10.0264L17.7417 14.0566L17.4487 14.2705L17.5601 14.6162L19.6782 21.1348L17.8394 22.4717L12.2935 18.4424L11.9995 18.2285L11.7056 18.4424L6.15967 22.4717L4.3208 21.1348L6.43896 14.6162L6.55127 14.2705L6.25732 14.0566L0.711426 10.0264L1.41357 7.86523H8.63232L8.74463 7.51953L10.8628 1H13.1362Z"
        fill={fill}
        stroke={stroke}
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default Star;
