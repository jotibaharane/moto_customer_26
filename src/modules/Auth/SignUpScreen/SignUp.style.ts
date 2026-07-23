import { COLORS, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 16,
    gap: 24,
    marginTop: vs(46),
  },

  headerWrapper: {
    position: 'relative',
  },

  signUpButton: {
    position: 'absolute',
    top: 84,
    left: 16,
    height: 40,
    width: 122,
    borderRadius: 8,
    backgroundColor: COLORS.white[100],
    borderWidth: 0,
    elevation: 5,
  },

  image: {
    position: 'absolute',
    width: 210,
    height: 150,
    top: 20,
    right: 12,
  },

  toggleContainer: {
    // marginBottom: hp(110),
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  flexBtn: {
    flex: 1,
  },

  continueBtn: {
    marginBottom: 24,
    minWidth: 200,
    alignSelf: 'center',
  },
});
