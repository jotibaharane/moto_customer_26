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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },

  trackingText: {
    color: COLORS.white[100],
    flex: 1,
  },

  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },

  mapContainer: {
    flex: 1,
  },

  map: {
    flex: 1,
    marginBottom: -30,
  },

  bottomCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[500],
    paddingVertical: 9,
    paddingHorizontal: 24,
    flexDirection: 'row',
    marginHorizontal: 16,
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
    fontSize: 14,
  },

  value: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: FONT_FAMILIES.semiBold,
    textAlign: 'center',
    backgroundColor: COLORS.white[100],
    paddingVertical: 5,
    paddingHorizontal: 15,
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: COLORS.white[100],
    borderRadius: 100,
    minHeight: 80,
    minWidth: 80,
    position: 'absolute',
    bottom: 20,
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
    borderRadius: 50,
    padding: 2,
  },
  postIdText: {
    fontSize: 8,
    fontFamily: FONT_FAMILIES.semiBold,
  },
});
