import {
  COLORS,
  FONT_FAMILIES,
  moderateScale,
  scale,
  verticalScale,
  vs,
} from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    paddingHorizontal: scale(16),
  },

  headerText: {
    marginTop: vs(57),
    textAlign: 'center',
    fontSize: moderateScale(24), // Figma font size same
    fontFamily: FONT_FAMILIES.bold,
  },

  fieldLabel: {
    marginTop: verticalScale(33),
    marginBottom: verticalScale(16),
    fontSize: moderateScale(12), // Figma font size same
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[650],
  },

  otpContainer: {
    marginTop: verticalScale(24),
  },

  pinCodeContainerStyle: {
    height: scale(56),
    width: scale(56),
    borderColor: COLORS.gray[250],
    borderWidth: 1,
    borderRadius: scale(16),
  },

  pinCodeTextStyle: {
    fontSize: moderateScale(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  filledPinCodeContainerStyle: {
    height: scale(56),
    width: scale(56),
    borderColor: COLORS.primary[500],
    borderWidth: 1,
    borderRadius: scale(16),
  },

  pinBox: {
    height: verticalScale(40),
    width: scale(45),
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray[250],
    borderRadius: 0,
  },

  filledPinBox: {
    height: verticalScale(40),
    width: scale(45),
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary[500],
    borderRadius: 0,
  },

  pinText: {
    fontSize: moderateScale(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  numberPadContainer: {
    marginTop: verticalScale(86),
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(12),
    marginTop: verticalScale(94),
  },

  button: {
    flex: 1,
  },
});
