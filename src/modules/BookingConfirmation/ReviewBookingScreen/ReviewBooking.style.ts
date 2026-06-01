import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: 16,
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
    paddingHorizontal: 32,
    borderLeftWidth: 1,
  },

  vehicleTitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleInfo: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 12,
  },

  cardRow: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: COLORS.gray[75],
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardText: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
  },

  addressContainer: {
    marginTop: 24,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  addressTitle: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 16,
    color: '#4C002E',
  },

  addressSubtitle: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 14,
    color: COLORS.gray[500],
  },

  divider: {
    height: 48,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderLeftColor: COLORS.black[500],
    marginLeft: 15,
    justifyContent: 'center',
  },

  distanceText: {
    marginLeft: 35,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  etaText: {
    marginTop: 65,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 16,
    elevation: 2,
    shadowColor: COLORS.black[500],
  },

  button: {
    marginTop: 49,
  },
});
