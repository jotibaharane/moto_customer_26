import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topWrapper: {
    paddingHorizontal: s(16),
    marginTop: vs(24),
    shadowOpacity: 1,
  },

  card: {
    backgroundColor: COLORS.gray[75],
    padding: s(10),
    borderRadius: s(16),
    elevation: 5,
    gap: vs(16),
  },

  row: {
    flexDirection: 'row',
    gap: s(20),
  },

  emptyBox: {
    width: s(30),
    height: s(30),
  },

  mapContainer: {
    flex: 1,
    borderRadius: vs(30),
    overflow: 'hidden',
  },

  map: {
    flex: 1,
    marginBottom: -vs(50),
  },

  marker: {
    padding: s(6),
    borderRadius: s(20),
    elevation: 6,
  },

  declare_weight_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(10),
  },

  declare_weight: {
    fontSize: ms(18), // Figma size same
    fontFamily: FONT_FAMILIES.medium,
  },

  weight_input: {
    backgroundColor: COLORS.white[100],
    height: vs(42),
    width: s(103),

    paddingHorizontal: s(7),

    borderRadius: s(8),

    fontFamily: FONT_FAMILIES.bold,
    fontSize: ms(16), // Figma size same
  },

  kg: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: ms(16), // Figma size same
  },
});
