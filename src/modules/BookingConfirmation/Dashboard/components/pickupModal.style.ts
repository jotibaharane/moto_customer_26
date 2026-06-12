import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: s(16),
    marginBottom: vs(20),
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,

    marginBottom: vs(16),
    paddingBottom: vs(7),

    gap: s(16),
  },

  title: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
  },

  subtitle: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(19),
  },

  sectionTitle: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.medium,
  },

  bookmarkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
  },

  gridButtonContainer: {
    flexBasis: '25%',
    marginTop: vs(20),

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderRadius: s(8),
  },

  gridLabel: {
    fontSize: ms(14),
    color: '#333',
    padding: s(8),
  },

  listLabel: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.primary[500],
  },

  currentLoactionButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',

    borderBottomWidth: 1,

    marginBottom: vs(16),
    paddingBottom: vs(7),

    gap: s(10),
  },

  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },

  bookmarkListContiner: {
    borderBottomWidth: 1,

    marginBottom: vs(16),
    paddingBottom: vs(7),

    gap: s(8),
  },

  customeBookmarkFieldContiner: {
    flexDirection: 'row',
    alignItems: 'center',

    width: s(150),

    borderWidth: 1,
    borderRadius: s(8),

    paddingHorizontal: s(8),
    marginTop: vs(12),
  },

  bookmarkField: {
    flex: 1,
    height: vs(40),
  },

  closeButton: {
    fontSize: ms(18),
    color: COLORS.gray[500],
    paddingHorizontal: s(8),
  },
});
