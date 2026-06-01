import { COLORS, FONT_FAMILIES, FONT_SIZES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* ================= LAYOUT ================= */
  container: {
    flex: 1,
    padding: 16,
  },

  /* ================= TEXT ================= */
  title: {
    marginTop: 57,
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black[500],
    marginBottom: 24,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    marginTop: 32,
  },

  expiryText: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    marginTop: 32,
    textAlign: 'center',
  },

  /* ================= INPUT ================= */
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    height: 54,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: COLORS.gray[250],
    padding: 16,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.medium,
  },

  /* ================= COUNTRY ================= */
  countryCodeContainer: {
    flexDirection: 'row',
    height: 54,
    width: 98,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: COLORS.gray[250],
    alignItems: 'center',
    justifyContent: 'center',
  },

  flag: {
    width: 23,
    height: 17,
    marginRight: 8,
  },

  countryCodeText: {
    color: COLORS.black[500],
    fontSize: 16,
    fontFamily: FONT_FAMILIES.regular,
    marginRight: 4,
  },

  /* ================= OTP ================= */
  otpContainer: {
    marginTop: 24,
  },
  pinCodeContainerStyle: {
    height: 56,
    width: 56,
    borderColor: COLORS.gray[250],
    borderWidth: 1,
    borderRadius: 16,
  },
  pinCodeTextStyle: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.semiBold,
  },
  filledPinCodeContainerStyle: {
    borderColor: COLORS.primary[500],
    height: 56,
    width: 56,
    borderWidth: 1,
    borderRadius: 16,
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: 24,
    alignSelf: 'center',
    minWidth: 200,
  },
  resendText: {
    textAlign: 'center',
    color: COLORS.primary[500],
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
