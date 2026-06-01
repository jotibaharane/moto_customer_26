import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: 16,
    gap: 24,
  },

  rowBox: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 16,
  },

  totalBox: {
    backgroundColor: COLORS.primary[300],
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  totalText: {
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.white[100],
    fontSize: 16,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  input: {
    marginHorizontal: 40,
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
    gap: 16,
  },

  tab: {
    flex: 1,
    height: 28.65,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: COLORS.primary[600],
  },

  tabText: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 16,
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
    fontSize: 16,
    color: COLORS.primary[600],
    textAlign: 'center',
  },

  receiptText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 16,
  },
});
