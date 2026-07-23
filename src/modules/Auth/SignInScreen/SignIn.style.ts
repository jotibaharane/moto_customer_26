import {
  COLORS,
  FONT_FAMILIES,
  moderateScale,
  scale,
  verticalScale,
} from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* ================= LAYOUT ================= */
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.white[100],
  },

  /* ================= TEXT ================= */
  title: {
    marginTop: verticalScale(57),
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.bold,
    fontSize: moderateScale(24),
    color: COLORS.black[500],
  },

  subtitle: {
    marginTop: verticalScale(32),
    fontSize: moderateScale(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: '#132235',
  },

  expiryText: {
    marginTop: verticalScale(32),
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    letterSpacing: 1,
  },

  /* ================= INPUT ================= */
  inputContainer: {
    marginTop: verticalScale(16),
    flexDirection: 'row',
    gap: scale(8),
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2E5A99',
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(16),
    fontFamily: FONT_FAMILIES.medium,
  },

  /* ================= COUNTRY CODE ================= */
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: scale(98),
    height: verticalScale(54),

    borderWidth: 1,
    borderColor: '#D3DDE7',
    borderRadius: scale(16),
  },

  flag: {
    width: scale(23),
    height: verticalScale(17),
    marginRight: scale(8),
  },

  countryCodeText: {
    color: COLORS.black[500],
    fontSize: moderateScale(16),
    fontFamily: FONT_FAMILIES.regular,
    marginRight: scale(4),
  },

  /* ================= OTP ================= */
  otpContainer: {
    marginTop: verticalScale(24),
  },

  pinCodeContainerStyle: {
    width: scale(56),
    height: scale(56),
    borderWidth: 1,
    borderColor: COLORS.gray[250],
    borderRadius: scale(16),
  },

  pinCodeTextStyle: {
    fontSize: moderateScale(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  filledPinCodeContainerStyle: {
    width: scale(40),
    height: scale(42),
    borderWidth: 2,
    borderColor: '#2E5A99',
    borderRadius: scale(16),
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: verticalScale(32),
    alignSelf: 'center',
    width: scale(191),
    minHeight: verticalScale(56),
  },

  resendText: {
    marginTop: verticalScale(12),
    textAlign: 'center',
    color: COLORS.primary[500],
    fontSize: moderateScale(14),
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
