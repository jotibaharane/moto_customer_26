import { COLORS, FONT_FAMILIES, fp, hp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(20),
  },
  text: {
    color: COLORS.white[500],
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 45,
  },
});
