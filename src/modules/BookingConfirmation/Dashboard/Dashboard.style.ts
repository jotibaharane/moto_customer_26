import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { Colors } from '@theme/New';
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
  width: '100%',
  gap: s(8),
},

declare_weight: {
  width: s(112),
  flexShrink: 0,
  fontSize: ms(14),
  fontFamily: FONT_FAMILIES.medium,
  lineHeight: vs(26),
  letterSpacing: -0.5,
},

weight_input: {
  backgroundColor: COLORS.white[100],
  width: s(87),
  height: vs(26),
  borderRadius: s(6),
  fontFamily: FONT_FAMILIES.bold,
  fontSize: ms(14),
  color: Colors.primary,
  paddingVertical: 0,
  paddingHorizontal: s(5),
  textAlign: 'center',
  includeFontPadding: false,
},

kg: {
  fontFamily: FONT_FAMILIES.semiBold,
  fontSize: ms(14),
  color: Colors.primary,
},
});
