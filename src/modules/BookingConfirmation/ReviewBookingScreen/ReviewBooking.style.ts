import { StyleSheet } from 'react-native';
import { FONT_FAMILIES, ms, s, vs } from '@theme/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: vs(72),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    gap: s(18),
  },

  backButton: {
    width: s(35),
    height: s(35),
    borderRadius: s(20),
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: ms(30),
    color: '#111111',
    lineHeight: vs(32),
    marginTop: -3,
  },

  headerTitle: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.bold,
    color: '#315D9C',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: s(15),
    paddingBottom: vs(20),
  },

  vehicleCard: {
    height: vs(103),
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    marginBottom: vs(24),
  },

  imageContainer: {
    width: '47%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  truckImage: {
    width: '100%',
    height: '85%',
  },

  vehicleDivider: {
    width: 1,
    height: '65%',
    backgroundColor: '#E5E5E5',
    marginHorizontal: s(7),
  },

  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: vs(5),
  },

  vehicleName: {
    fontSize: ms(12),
    fontFamily: FONT_FAMILIES.medium,
    color: '#555555',
  },

  vehicleDetails: {
    fontSize: ms(12),
    fontFamily: FONT_FAMILIES.regular,
    color: '#555555',
  },

  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },

  infoIcon: {
    fontSize: ms(12),
    color: '#7B8490',
  },

  summaryCard: {
    height: vs(53),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: s(10),
    paddingHorizontal: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(11),
  },

  cardText: {
    fontSize: ms(13),
    fontFamily: FONT_FAMILIES.bold,
    color: '#111111',
  },

  addressContainer: {
    marginTop: vs(25),
    paddingHorizontal: s(2),
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    minHeight: vs(42),
  },

  addressContent: {
    flex: 1,
  },

  addressTitle: {
    fontSize: ms(13),
    fontFamily: FONT_FAMILIES.medium,
    color: '#111111',
    marginBottom: vs(5),
  },

  addressSubtitle: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: '#A5A5A5',
  },

  routeDivider: {
    height: vs(85),
    marginLeft: s(12),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  dashedLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#777777',
  },

  distanceText: {
    marginLeft: s(30),
    fontSize: ms(18),
    fontFamily: FONT_FAMILIES.bold,
    color: '#315D9C',
  },

  etaText: {
    marginTop: vs(60),
    marginBottom: vs(15),
    textAlign: 'center',
    fontSize: ms(13),
    fontFamily: FONT_FAMILIES.bold,
    color: '#111111',
  },

  bottomContainer: {
    paddingHorizontal: s(20),
    paddingTop: vs(10),
    backgroundColor: '#FFFFFF',
  },

  confirmButton: {
    height: vs(45),
    borderRadius: s(9),
    backgroundColor: '#315D9C',
    marginTop: 0,
  },
});