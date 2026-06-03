import { COLORS, FONT_FAMILIES } from '@theme/index';
import { StyleSheet } from 'react-native';
import { s, vs, ms } from '@theme/index'; // path as per your project

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    paddingHorizontal: s(16),
    backgroundColor: COLORS.white[100],
  },

  title: {
    marginTop: vs(79),
    fontFamily: FONT_FAMILIES.bold,
    fontSize: ms(24), // Figma font size
    color: COLORS.black[500],
  },

  subtitle: {
    marginTop: vs(29),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[400],
    fontSize: ms(14), // Figma font size
  },

  radioContainer: {
    marginTop: vs(45),
  },

  buttonContainer: {
    marginTop: vs(65),
    width: '60%',
    alignSelf: 'center',
  },

  infoRow: {
    marginTop: vs(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(18),
  },

  infoText: {
    fontSize: ms(12), // Figma font size
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary[400],
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(37),
    gap: s(10),
  },

  stepDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: COLORS.gray[150],
  },

  stepActive: {
    width: s(20),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: COLORS.primary[500],
  },
});
