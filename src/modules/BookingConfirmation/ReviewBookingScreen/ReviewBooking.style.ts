import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: fp(16),
  },

  vehicleCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.gray[75],
    borderRadius: 8,
    padding: 10,
  },

  vehicleDetails: {
    justifyContent: 'center',
    paddingHorizontal: wp(32),
    borderLeftWidth: 1,
  },

  vehicleTitle: {
    fontSize: fp(12),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleInfo: {
    fontSize: fp(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: hp(12),
  },

  cardRow: {
    marginTop: hp(26),
    borderWidth: 1,
    borderColor: COLORS.gray[75],
    paddingVertical: hp(15),
    paddingHorizontal: wp(10),
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardText: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  addressContainer: {
    marginTop: hp(24),
  },

  row: {
    flexDirection: 'row',
    gap: fp(12),
    alignItems: 'center',
  },

  addressTitle: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: fp(16),
    color: '#4C002E',
  },

  addressSubtitle: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: fp(14),
    color: COLORS.gray[500],
  },

  divider: {
    height: hp(48),
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderLeftColor: COLORS.black[500],
    marginLeft: fp(15),
    justifyContent: 'center',
  },

  distanceText: {
    marginLeft: wp(35),
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  etaText: {
    marginTop: hp(65),
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(16),
    elevation: 2,
    shadowColor: COLORS.black[500],
  },

  button: {
    marginTop: hp(49),
  },
});
