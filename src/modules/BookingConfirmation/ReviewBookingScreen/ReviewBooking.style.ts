import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: s(16),
  },

  vehicleCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.gray[75],
    borderRadius: s(8),
    padding: s(10),
  },

  vehicleDetails: {
    justifyContent: 'center',
    paddingHorizontal: s(32),
    borderLeftWidth: 1,
  },

  vehicleTitle: {
    fontSize: ms(12),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleInfo: {
    fontSize: ms(12),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: vs(12),
  },

  cardRow: {
    marginTop: vs(26),

    borderWidth: 1,
    borderColor: COLORS.gray[75],
    borderRadius: s(12),

    paddingVertical: vs(15),
    paddingHorizontal: s(10),

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardText: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
  },

  addressContainer: {
    marginTop: vs(24),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },

  addressTitle: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: ms(16),
    color: '#4C002E',
  },

  addressSubtitle: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: ms(14),
    color: COLORS.gray[500],
  },

  divider: {
    height: vs(48),
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderLeftColor: COLORS.black[500],
    marginLeft: s(15),
    justifyContent: 'center',
  },

  distanceText: {
    marginLeft: s(35),
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  etaText: {
    marginTop: vs(65),
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: ms(16),

    elevation: 2,
    shadowColor: COLORS.black[500],
  },

  button: {
    marginTop: vs(49),
  },
});
