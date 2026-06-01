import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  inputsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  codeContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#DFDFDE',
    height: 60,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 28,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      ios: {
        opacity: 0.02,
        color: 'transparent',
      },
      default: {
        opacity: 0,
      },
    }),
  },
  stick: {
    width: 2,
    height: 30,
    backgroundColor: 'green',
  },
});
