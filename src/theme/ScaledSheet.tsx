import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import deepMap from './deep-map';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

type ScaleFn = (size: number) => number;
type ModerateScaleFn = (size: number, factor?: number | string) => number;

// Groups                     Size                   Func Factor
//                             1                      2    3
const validScaleSheetRegex =
  /^(\-?\d+(?:\.\d{1,3})?)@(mv?s(\d+(?:\.\d{1,2})?)?|s|vs)r?$/;

const scaleByAnnotation =
  (
    scale: ScaleFn,
    verticalScale: ScaleFn,
    moderateScale: ModerateScaleFn,
    moderateVerticalScale: ModerateScaleFn,
  ) =>
  (value: unknown): unknown => {
    if (typeof value !== 'string' || !validScaleSheetRegex.test(value)) {
      return value;
    }

    const regexExecResult = validScaleSheetRegex.exec(value);

    if (!regexExecResult) {
      return value;
    }

    const size = parseFloat(regexExecResult[1]);
    let scaleFunc = regexExecResult[2];
    const scaleFactor = regexExecResult[3];

    if (scaleFactor) {
      scaleFunc = scaleFunc.slice(0, -scaleFactor.length);
    }

    const shouldRound = value.endsWith('r');

    let result: number;

    switch (scaleFunc) {
      case 's':
        result = scale(size);
        break;

      case 'vs':
        result = verticalScale(size);
        break;

      case 'ms':
        result = moderateScale(size, scaleFactor);
        break;

      case 'mvs':
        result = moderateVerticalScale(size, scaleFactor);
        break;

      default:
        return value;
    }

    return shouldRound ? Math.round(result) : result;
  };

const scaledSheetCreator = (
  scale: ScaleFn,
  verticalScale: ScaleFn,
  moderateScale: ModerateScaleFn,
  moderateVerticalScale: ModerateScaleFn,
) => {
  const scaleFunc = scaleByAnnotation(
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
  );

  return {
    create<T extends NamedStyles<T> | NamedStyles<any>>(styleSheet: T): T {
      return StyleSheet.create(deepMap(styleSheet, scaleFunc) as T);
    },
  };
};

export default scaledSheetCreator;
