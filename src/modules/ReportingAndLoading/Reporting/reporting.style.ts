import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 8,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 150,
    zIndex: 999,
    left: '12%',
    right: '12%',
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
    textAlign: 'center',
    backgroundColor: COLORS.white[100],
    paddingVertical: hp(5),
    paddingHorizontal: wp(15),
    borderWidth: 0.5,
  },
  tooltipContainer: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tooltipText: {
    fontSize: 12,
  },
  callButton: {
    paddingHorizontal: fp(10),
    paddingVertical: fp(20),
    backgroundColor: COLORS.white[100],
    borderRadius: fp(100),
    minHeight: hp(80),
    minWidth: wp(80),
    position: 'absolute',
    bottom: hp(20),
    left: 10,
    borderWidth: 2,
    borderColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  callRows: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  phoneRotate: {
    transform: [{ rotate: '45deg' }],
  },
  userIconWrapper: {
    height: 26,
    width: 26,
    backgroundColor: COLORS.gray[100],
    borderRadius: fp(50),
    padding: 2,
  },
  postIdText: {
    fontSize: fp(8),
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
