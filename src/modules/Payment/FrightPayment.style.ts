import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: s(16),
    gap: vs(24),
  },

  rowBox: {
    flexDirection: 'row',
    height: vs(50),
    borderWidth: 0.5,
    borderRadius: s(8),
    borderColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
  },

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: ms(16),
  },

  totalBox: {
    backgroundColor: COLORS.primary[300],
    minHeight: vs(56),
    borderRadius: s(8),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  totalText: {
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.white[100],
    fontSize: ms(16),
    paddingHorizontal: s(22),
    paddingVertical: vs(18),
  },

  input: {
    marginHorizontal: s(40),
    height: vs(56),

    borderWidth: 1,
    borderRadius: s(8),

    paddingHorizontal: s(15),
    paddingVertical: vs(10),

    fontSize: ms(16),
    color: '#000',
  },

  tabContainer: {
    flexDirection: 'row',
    gap: s(16),
  },

  tab: {
    flex: 1,
    minHeight: vs(32),
    borderWidth: 1,
    borderRadius: s(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: COLORS.primary[600],
  },

  tabText: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: ms(16),
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
    width: s(94),
    height: vs(96),
  },

  successText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: ms(16),
    color: COLORS.primary[600],
    textAlign: 'center',
  },

  receiptText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: ms(16),
  },
});
