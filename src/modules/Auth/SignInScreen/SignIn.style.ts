import { COLORS, FONT_FAMILIES, FONT_SIZES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* ================= LAYOUT ================= */
  container: {
    flex: 1,
    padding: hp(16),
  },

  /* ================= TEXT ================= */
  title: {
    marginTop: hp(57),
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black[500],
    marginBottom: hp(24),
    textAlign: 'center',
  },

  subtitle: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    marginTop: hp(32),
  },

  expiryText: {
    fontSize: fp(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    marginTop: hp(32),
    textAlign: 'center',
  },

  /* ================= INPUT ================= */
  inputContainer: {
    marginTop: hp(16),
    flexDirection: 'row',
    gap: wp(8),
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: hp(16),
    borderColor: COLORS.gray[250],
    padding: hp(16),
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.medium,
  },

  /* ================= COUNTRY ================= */
  countryCodeContainer: {
    flexDirection: 'row',
    height: hp(54),
    width: hp(98),
    borderWidth: 1,
    borderRadius: hp(16),
    borderColor: COLORS.gray[250],
    alignItems: 'center',
    justifyContent: 'center',
  },

  flag: {
    width: wp(23),
    height: hp(17),
    marginRight: wp(8),
  },

  countryCodeText: {
    color: COLORS.black[500],
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.regular,
    marginRight: wp(4),
  },

  /* ================= OTP ================= */
  otpContainer: {
    marginTop: hp(24),
  },
  pinCodeContainerStyle: {
    height: hp(56),
    width: wp(56),
    borderColor: COLORS.gray[250],
    borderWidth: 1,
    borderRadius: 16,
  },
  pinCodeTextStyle: {
    fontSize: fp(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },
  filledPinCodeContainerStyle: {
    borderColor: COLORS.primary[500],
    height: hp(56),
    width: wp(56),
    borderWidth: 2,
    borderRadius: 16,
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: hp(24),
  },
  resendText: {
    textAlign: 'center',
    color: COLORS.primary[500],
    marginTop: hp(12),
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
