import { COLORS, FONT_FAMILIES } from '@theme/index';
import { fs, ms, s, vs } from '@theme/New';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* ================= LAYOUT ================= */
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    backgroundColor: COLORS.white[100],
  },

  /* ================= TEXT ================= */
  title: {
    marginTop: vs(57),
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.bold,
    fontSize: ms(24),
    color: COLORS.black[500],
  },

  subtitle: {
    marginTop: vs(27),
    fontSize: fs(16),
    fontFamily: FONT_FAMILIES.semiBold,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: '#132235',
  },

  expiryText: {
    marginTop: vs(32),
    textAlign: 'center',
    fontSize: fs(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    letterSpacing: -1,
  },

  /* ================= INPUT ================= */
  inputContainer: {
    marginTop: vs(24),
    flexDirection: 'row',
    gap: s(8),
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2E5A99',
    borderRadius: s(16),
    paddingHorizontal: s(16),
    fontSize: fs(16),
    fontFamily: FONT_FAMILIES.medium,
  },

  /* ================= COUNTRY CODE ================= */
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: s(98),
    height: vs(54),

    borderWidth: 1,
    borderColor: '#D3DDE7',
    borderRadius: s(16),
  },

  flag: {
    width: s(23),
    height: vs(17),
    marginRight: s(8),
  },

  countryCodeText: {
    color: COLORS.black[500],
    fontSize: fs(16),
    fontFamily: FONT_FAMILIES.regular,
    marginRight: s(4),
  },

  /* ================= OTP ================= */
  otpContainer: {
    marginTop: vs(24),
  },

  pinCodeContainerStyle: {
    width: s(42),
    height: s(40),
    borderWidth: 1,
    borderColor: COLORS.gray[250],
    borderRadius: s(8),
  },

  pinCodeTextStyle: {
    fontSize: fs(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  filledPinCodeContainerStyle: {
    width: s(42),
    height: s(40),
    borderWidth: 2,
    borderColor: COLORS.primary[500],
    borderRadius: s(8),
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: vs(32),
    alignSelf: 'center',
    width: s(191),
    minHeight: vs(56),
  },

  resendText: {
    marginTop: vs(12),
    textAlign: 'center',
    color: COLORS.primary[500],
    fontSize: fs(14),
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
