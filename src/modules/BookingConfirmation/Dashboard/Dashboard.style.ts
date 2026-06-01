import { COLORS, FONT_FAMILIES, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topWrapper: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },

  card: {
    backgroundColor: COLORS.gray[75],
    padding: 10,
    borderRadius: 16,
    elevation: 5,
    gap: 16,
  },

  row: {
    flexDirection: 'row',
    gap: 20,
  },

  emptyBox: {
    width: 30,
    height: 30,
  },

  mapContainer: {
    flex: 1,
  },

  map: {
    flex: 1,
    marginBottom: -50,
  },

  marker: {
    padding: 6,
    borderRadius: 20,
    elevation: 6,
  },
  declare_weight_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  declare_weight: { fontSize: 18, fontFamily: FONT_FAMILIES.medium },
  weight_input: {
    backgroundColor: COLORS.white[100],
    height: 42,
    padding: 7,
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 16,
    width: 103,
    borderRadius: 8,
  },
  kg: { fontFamily: FONT_FAMILIES.semiBold, fontSize: 16 },
});
