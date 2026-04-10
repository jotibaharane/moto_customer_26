import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';
const Wave: React.FC<SvgProps> = props => (
  <Svg
    // width={428}
    // height={235}

    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M-726 180L-701 186C-676 192 -626 204 -576 192C-526 180 -476 144 -426 114C-376 84 -326 60 -276 48C-226 36 -176 36 -126 84C-76 132 -26 228 24 234C74 240 124 156 174 144C224 132 274 192 324 186C374 180 424 108 449 72L474 36V0H449C424 0 374 0 324 0C274 0 224 0 174 0C124 0 74 0 24 0C-26 0 -76 0 -126 0C-176 0 -226 0 -276 0C-326 0 -376 0 -426 0C-476 0 -526 0 -576 0C-626 0 -676 0 -701 0H-726V180Z"
      fill="url(#paint0_linear_1_5791)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1_5791"
        x1={-726}
        y1={117.153}
        x2={474}
        y2={117.153}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#091E3A" />
        <Stop offset={0.5} stopColor="#91A2BE" />
        <Stop offset={1} stopColor="#385380" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default Wave;
