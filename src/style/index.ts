import { COLORS, FONT_FAMILIES, FONT_SIZES } from '@theme/index';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[500],
    padding: 16,
  },

  text: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.black[500],
  },

  title: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary[500],
  },
});
