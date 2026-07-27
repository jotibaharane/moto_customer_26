import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 428;
const guidelineBaseHeight = 926;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const fontScale = (size: number) =>
  moderateScale(size) / PixelRatio.getFontScale();

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const fs = fontScale;
