import {
  COLORS,
  FONT_FAMILIES,
  moderateScale,
  scale,
  verticalScale,
} from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    paddingLeft: scale(43),
    paddingRight: scale(42),
    backgroundColor: COLORS.white[100],
  },

  logoContainer: {
    marginTop: verticalScale(31),
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: scale(343),
    height: verticalScale(408),
  },

  title: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: moderateScale(24),
    color: COLORS.primary[500],
  },

  subtitle: {
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[400],
    fontSize: moderateScale(14),
  },

  radioContainer: {
    marginVertical: verticalScale(23),
    maxHeight: verticalScale(240),
  },

  buttonContainer: {
    marginHorizontal: scale(79),
  },

  infoRow: {
    marginTop: verticalScale(45),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(18),
  },

  infoText: {
    fontSize: moderateScale(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary[400],
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(37),
    gap: scale(10),
  },

  stepDot: {
    height: scale(10),
    width: scale(10),
    backgroundColor: COLORS.gray[150],
    borderRadius: scale(5),
  },

  stepActive: {
    height: scale(10),
    width: scale(20),
    backgroundColor: COLORS.primary[500],
    borderRadius: scale(5),
  },
  button: { alignSelf: 'center', width: scale(213) },
});
