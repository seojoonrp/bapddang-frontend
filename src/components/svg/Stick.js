import { Svg, Path } from "react-native-svg";

const Stick = ({ width = 24, height = 823, scale = 1, rotate = 0, color = "#FFC77D" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width*scale}
      height={height*scale}
      viewBox="0 0 24 823"
      fill="none"
      style={{ transform: [{ rotate: `${rotate}deg` }] }}
    >
      <Path
        d="M7.72787 1.98577C7.73565 0.886759 8.62878 0 9.72782 0H14.2722C15.3712 0 16.2643 0.88682 16.2721 1.98583L23.9857 1090.99C23.9936 1092.1 23.0959 1093 21.9858 1093H2.01422C0.904112 1093 0.00640384 1092.1 0.0142667 1090.99L7.72787 1.98577Z"
        fill={color}
      />
    </Svg>
  );
};

export default Stick;