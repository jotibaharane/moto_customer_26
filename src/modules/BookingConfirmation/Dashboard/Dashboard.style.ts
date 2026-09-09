import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { Colors } from '@theme/New';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  topWrapper: {
    paddingHorizontal: s(16),
    marginTop: vs(24),
    shadowOpacity: 1,
  },

  card: {
    backgroundColor: '#E1E1E1',
    padding: s(10),
    borderRadius: s(16),
    elevation: 5,
    gap: vs(16),
  },

  row: {
    flexDirection: 'row',
    gap: s(20),
    alignItems: 'center',
  },

  declare_weight_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: s(12),
  },

  declare_weight: {
    flex: 1,
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: vs(25),
    letterSpacing: -0.5,
    color: '#000000',
  },

  weight_input: {
    backgroundColor: COLORS.white[100],
    width: s(87),
    height: vs(40),
    borderRadius: s(8),
    paddingHorizontal: s(8),
    paddingVertical: 0,
    fontFamily: FONT_FAMILIES.bold,
    fontSize: ms(16),
    color: '#000000',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  kg: {
    width: s(24),
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: ms(16),
    color: '#000000',
  },
});