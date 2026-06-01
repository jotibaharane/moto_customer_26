import { COLORS, FONT_FAMILIES, FONT_SIZES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    padding: 16,
  },

  title: {
    marginTop: 79,
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black[500],
    marginBottom: 29,
  },

  subtitle: {
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[400],
    fontSize: FONT_SIZES.sm,
  },

  radioContainer: {
    marginTop: 45,
  },

  buttonContainer: {
    marginHorizontal: 79,
    marginTop: 65,
  },

  infoRow: {
    marginTop: 45,
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.primary[400],
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 37,
    gap: 10,
  },

  stepDot: {
    height: 10,
    width: 10,
    backgroundColor: COLORS.gray[150],
    borderRadius: 5,
  },

  stepActive: {
    height: 10,
    width: 20,
    backgroundColor: COLORS.primary[500],
    borderRadius: 5,
  },
});
