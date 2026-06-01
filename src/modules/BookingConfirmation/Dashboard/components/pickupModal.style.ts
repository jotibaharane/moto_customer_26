import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.medium,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonContainer: {
    flexBasis: '25%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 14,
    color: '#333',
    padding: 8,
  },
  listLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.primary[500],
  },
  currentLoactionButton: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 7,
    alignItems: 'flex-start',
    gap: 10,
    flexDirection: 'column',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bookmarkListContiner: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 7,
    gap: 8,
  },
  customeBookmarkFieldContiner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    width: 150,
  },
  bookmarkField: {
    flex: 1,
    height: 40,
  },
  closeButton: {
    fontSize: 18,
    color: COLORS.gray[500],
    paddingHorizontal: 8,
  },
});
