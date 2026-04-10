import { COLORS, FONT_FAMILIES, FONT_SIZES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    padding: hp(16),
  },

  title: {
    marginTop: hp(79),
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black[500],
    marginBottom: hp(24),
  },

  subtitle: {
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[400],
    fontSize: FONT_SIZES.sm,
  },

  radioContainer: {
    marginTop: hp(45),
  },

  buttonContainer: {
    marginHorizontal: wp(79),
    marginTop: hp(65),
  },

  infoRow: {
    marginTop: hp(45),
    flexDirection: 'row',
    gap: wp(18),
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    fontSize: fp(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary[400],
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(37),
    gap: wp(10),
  },

  stepDot: {
    height: hp(10),
    width: wp(10),
    backgroundColor: COLORS.gray[150],
    borderRadius: hp(5),
  },

  stepActive: {
    height: hp(10),
    width: wp(20),
    backgroundColor: COLORS.primary[500],
    borderRadius: hp(5),
  },
});
