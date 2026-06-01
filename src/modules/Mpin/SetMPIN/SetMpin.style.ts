import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: 16,
  },

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
  pinBox: {
    height: 40,
    width: 45,
    borderBottomColor: COLORS.gray[250],
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
  },

  filledPinBox: {
    height: 40,
    width: 45,
    borderWidth: 0,
    borderBottomColor: COLORS.primary[500],
    borderBottomWidth: 2,
    borderRadius: 0,
  },

  pinText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.semiBold,
  },

  numberPadContainer: {
    marginTop: 86,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 94,
  },

  button: {
    flex: 1,
  },
});
