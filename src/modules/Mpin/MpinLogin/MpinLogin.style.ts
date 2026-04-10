import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: wp(16),
  },

  title: {
    fontSize: fp(24),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  subtitle: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.gray[500],
  },

  otpWrapper: {
    marginTop: hp(55),
  },

  otpContainer: {
    gap: wp(16),
  },

  pinBox: {
    height: hp(45),
    width: wp(45),
    borderColor: COLORS.gray[250],
    borderWidth: 1,
    borderRadius: 16,
  },

  filledPinBox: {
    borderColor: COLORS.primary[500],
    height: hp(45),
    width: wp(45),
    borderWidth: 2,
    borderRadius: 16,
  },

  pinText: {
    fontSize: fp(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  helperText: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: hp(8),
  },

  loginButton: {
    marginTop: hp(52),
  },
});
