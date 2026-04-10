import { COLORS, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: hp(16),
    gap: hp(24),
  },

  headerWrapper: {
    position: 'relative',
  },

  signUpButton: {
    position: 'absolute',
    top: hp(84),
    left: wp(16),
    height: hp(40),
    width: wp(122),
    borderRadius: 8,
    backgroundColor: COLORS.white[100],
    borderWidth: 0,
    elevation: 5,
  },

  image: {
    position: 'absolute',
    width: wp(210),
    height: hp(150),
    top: hp(20),
    right: wp(12),
  },

  toggleContainer: {
    marginBottom: hp(110),
    flexDirection: 'row',
    gap: wp(12),
    justifyContent: 'center',
  },

  flexBtn: {
    flex: 1,
  },

  continueBtn: {
    marginTop: hp(24),
  },
});
