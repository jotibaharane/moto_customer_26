import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export * from './scaling-utils';
/**
 * Based on iPhone 11 design (375x812)
 * You can change base if needed
 */
const BASE_WIDTH = 428;
const BASE_HEIGHT = 926;

/* Width scale */
const wp = (size: number) => (width / BASE_WIDTH) * size;

/* Height scale */
const hp = (size: number) => (height / BASE_HEIGHT) * size;

/* Font scale */
const fp = (size: number, factor: number = 0.5) =>
  size + (hp(size) - size) * factor;

export { fp, hp, wp };

export const COLORS = {
  primary: {
    50: '#EEF2F7',
    100: '#D6DEE9',
    200: '#AEBED3',
    300: '#7589AA',
    400: '#5F6C8A',
    500: '#2E5A99', // original
    600: '#2E446A',
    700: '#243555',
    800: '#1A253F',
    900: '#10162A',
  },

  gray: {
    50: '#F5F5F5',
    75: '#E1E1E1',
    100: '#E0E0E0',
    150: '#D0D7E2', // 👈 add here
    200: '#C2C2C2',
    250: '#B3B3B3',
    300: '#A3A3A3',
    400: '#8A8A8A',
    500: '#9E9E9E', // original (slightly adjusted scale)
    600: '#757575',
    650: '#6C7278',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  black: {
    100: '#666666',
    200: '#4D4D4D',
    300: '#333333',
    400: '#1A1A1A',
    500: '#000000',
  },

  white: {
    100: '#FFFFFF',
    200: '#FAFAFA',
    300: '#F5F5F5',
    400: '#EEEEEE',
    500: '#FFFFFF',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
};

export const FONT_FAMILIES = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
};
