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

    alignSelf: 'flex-start',
  },

  distanceText: {
    marginLeft: s(35),
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
    backgroundColor: '#F2F5FB',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
  },

  weightBox: {
    padding: ms(8),
    backgroundColor: '#F2F5FB',
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
  },

  circle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primary[50],
    left: -90,
    top: -30,
  },

  truckImage: {
    width: 150,
    height: 110,
    alignSelf: 'flex-end',
    marginRight: -30,
  },

  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 40,
  },

  vehicleName: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.bold,
    marginBottom: 8,
    textAlign: 'center',
  },

  vehicleDetails: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.gray[600],
  },
});
