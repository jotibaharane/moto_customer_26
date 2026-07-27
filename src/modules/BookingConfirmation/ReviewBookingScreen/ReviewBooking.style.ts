import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { Colors, fs } from '@theme/New';
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
    color: Colors.black,
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

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.gray[250],
    borderRadius: 20,
    overflow: 'hidden',
  },

  image: {
    height: vs(150),
    width: s(150),
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

  listContainer: {
    paddingVertical: 20,
    paddingBottom: 120,
  },

  selectedCard: {
    borderColor: COLORS.primary[500],
    borderWidth: 2,
  },

  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 1,
  },

  circle: {
    position: 'absolute',
    width: 220,
    height: 150,
    borderRadius: 110,
    backgroundColor: COLORS.primary[50],
    left: -75,
    top: 0,
  },

  truckImage: {
    width: 150,
    height: 150,
    alignSelf: 'flex-end',
  },

  cardContent: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    flex: 4,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flex: 1,
    justifyContent: 'center',
  },

  vehicleName: {
    fontSize: fs(16),
    fontFamily: FONT_FAMILIES.bold,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },

  vehicleDetails: {
    marginLeft: 8,
    fontSize: fs(14),
    color: COLORS.gray[600],
    letterSpacing: -1,
    textAlign: 'center',
  },
});
