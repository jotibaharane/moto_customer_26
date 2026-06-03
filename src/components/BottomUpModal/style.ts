import { s, vs } from '@theme/scaling-utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#00000077',
  },
  mask: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: 0,
    overflow: 'hidden',
  },
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: s(35),
    height: vs(5),
    borderRadius: s(5),
    margin: s(10),
    backgroundColor: '#ccc',
  },
});

export default styles;
