import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: wp(16),
  },

  otpContainer: {
    gap: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(53),
  },

  pinBox: {
    height: hp(40),
    width: wp(45),
    borderBottomColor: COLORS.gray[250],
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
  },

  filledPinBox: {
    height: hp(40),
    width: wp(45),
    borderWidth: 0,
    borderBottomColor: COLORS.primary[500],
    borderBottomWidth: 2,
    borderRadius: 0,
  },

  pinText: {
    fontSize: fp(18),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  numberPadContainer: {
    marginTop: hp(86),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: wp(12),
    justifyContent: 'center',
    marginTop: hp(31),
  },

  button: {
    flex: 1,
  },
});
