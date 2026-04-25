import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: fp(16),
    gap: hp(24),
  },

  rowBox: {
    flexDirection: 'row',
    height: hp(50),
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: fp(16),
  },

  totalBox: {
    backgroundColor: COLORS.primary[300],
    height: hp(56),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  totalText: {
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.white[100],
    fontSize: fp(16),
    paddingHorizontal: wp(22),
    paddingVertical: hp(18),
  },

  input: {
    marginHorizontal: wp(40),
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 56,
    fontSize: 16,
    color: '#000',
  },

  tabContainer: {
    flexDirection: 'row',
    gap: wp(16),
  },

  tab: {
    flex: 1,
    height: hp(28.65),
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: COLORS.primary[600],
  },

  tabText: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: fp(16),
    color: COLORS.primary[600],
    textAlign: 'center',
  },

  activeTabText: {
    color: COLORS.white[100],
  },

  bottomContainer: {
    flex: 1,
  },

  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 94,
    height: 96,
  },

  successText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(16),
    color: COLORS.primary[600],
  },

  receiptText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(16),
  },
});
