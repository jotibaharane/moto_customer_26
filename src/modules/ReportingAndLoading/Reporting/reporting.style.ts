import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 8,
  },

  trackingBtn: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: fp(4),
    marginTop: hp(4),
  },

  trackingText: {
    color: COLORS.white[100],
  },

  headerCenter: {
    flex: 1,
    marginLeft: wp(12),
  },

  mapContainer: {
    flex: 1,
  },

  map: {
    flex: 1,
    marginBottom: -hp(30),
  },

  bottomCard: {
    borderRadius: fp(8),
    borderWidth: 1,
    borderColor: COLORS.primary[500],
    paddingVertical: hp(9),
    paddingHorizontal: wp(24),
    flexDirection: 'row',
    marginHorizontal: wp(16),
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },

  column: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: fp(14),
  },

  value: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(14),
  },

  callRow: {
    flexDirection: 'row',
    gap: 12,
  },
  marker: {
    padding: 6,
    borderRadius: 20,
    elevation: 6,
  },
  headerText: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
