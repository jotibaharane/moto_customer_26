import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: fp(16),
  },

  section: {
    marginTop: hp(24),
  },

  row: {
    flexDirection: 'row',
    gap: fp(12),
    alignItems: 'center',
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: fp(16),
    color: '#4C002E',
  },

  subText: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: fp(14),
    color: COLORS.gray[500],
  },

  distanceLine: {
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

  weightBox: {
    padding: fp(8),
    backgroundColor: COLORS.gray[75],
    borderRadius: 8,
    height: hp(38),
    alignSelf: 'flex-start',
    marginTop: hp(16),
  },

  weightText: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black[500],
  },

  card: {
    flexDirection: 'row',
    gap: fp(24),
    marginTop: hp(24),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[250],
    paddingBottom: hp(24),
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },

  image: {
    height: hp(150),
    width: wp(150),
  },

  cardContent: {
    justifyContent: 'center',
    gap: hp(4),
  },

  vehicleName: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
  },

  vehicleDetails: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  button: {
    marginTop: hp(24),
    alignSelf: 'center',
    paddingHorizontal: wp(40),
  },

  /* ================= EMPTY STATE ================= */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(40),
  },

  emptyCard: {
    width: '100%',
    padding: fp(20),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[250],
    backgroundColor: COLORS.white[100],
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    marginTop: hp(10),
  },

  emptySubText: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: hp(4),
  },
});
