import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.semiBold,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.gray[500],
  },

  otpWrapper: {
    marginTop: 55,
  },

  otpContainer: {
    gap: 16,
  },

  pinBox: {
    height: 45,
    width: 45,
    borderColor: COLORS.gray[250],
    borderWidth: 1,
    borderRadius: 16,
  },

  filledPinBox: {
    borderColor: COLORS.primary[500],
    height: 45,
    width: 45,
    borderWidth: 2,
    borderRadius: 16,
  },

  pinText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.semiBold,
  },

  helperText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },

  loginButton: {
    marginTop: 52,
  },
});
