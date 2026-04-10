import { COLORS, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topWrapper: {
    paddingHorizontal: wp(16),
    marginTop: hp(24),
  },

  card: {
    backgroundColor: COLORS.gray[75],
    padding: 10,
    borderRadius: 16,
    elevation: 5,
    gap: hp(16),
  },

  row: {
    flexDirection: 'row',
    gap: wp(20),
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
  },

  marker: {
    padding: 6,
    borderRadius: 20,
    elevation: 6,
  },
});
