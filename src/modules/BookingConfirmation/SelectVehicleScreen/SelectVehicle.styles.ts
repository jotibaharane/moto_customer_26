import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: s(16),
  },

  section: {
    marginTop: vs(24),
  },

  row: {
    flexDirection: 'row',
    gap: s(12),
    alignItems: 'center',
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: ms(16),
    color: '#4C002E',
  },

  subText: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: ms(14),
    color: COLORS.gray[500],
  },

  distanceLine: {
    height: vs(48),
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderLeftColor: COLORS.black[500],
    marginLeft: ms(15),
    justifyContent: 'center',
  },

  distanceText: {
    marginLeft: s(35),
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  weightBox: {
    padding: ms(8),
    backgroundColor: COLORS.gray[75],
    borderRadius: 8,
    height: vs(38),
    alignSelf: 'flex-start',
    marginTop: vs(16),
  },

  weightText: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black[500],
  },

  card: {
    flexDirection: 'row',
    gap: ms(24),
    marginTop: vs(24),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[250],
    paddingBottom: vs(24),
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },

  image: {
    height: vs(150),
    width: s(150),
  },

  cardContent: {
    justifyContent: 'center',
    gap: vs(4),
  },

  vehicleName: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
  },

  vehicleDetails: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  button: {
    marginTop: vs(24),
    alignSelf: 'center',
    paddingHorizontal: s(40),
  },

  /* ================= EMPTY STATE ================= */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(40),
  },

  emptyCard: {
    width: '100%',
    padding: ms(20),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[250],
    backgroundColor: COLORS.white[100],
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    marginTop: vs(10),
  },

  emptySubText: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: vs(4),
  },
});
