import { ms, s, vs } from '@theme/scaling-utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: ms(18),
    fontWeight: '600',
    color: '#2563eb',
  },

  postId: {
    fontSize: ms(14),
    color: '#1e3a8a',
  },

  date: {
    marginTop: vs(16),
    fontSize: ms(16),
    fontWeight: '600',
  },

  list: {
    marginTop: vs(20),
    paddingBottom: vs(40),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(20),
  },

  time: {
    width: s(80),
    fontSize: ms(12),
    color: '#555',
  },

  timeline: {
    width: s(30),
    alignItems: 'center',
  },

  circle: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    backgroundColor: '#1e3a8a',
  },

  line: {
    width: s(2),
    flex: 1,
    backgroundColor: '#ccc',
    marginTop: vs(2),
  },

  title: {
    flex: 1,
    fontSize: ms(14),
    color: '#1e3a8a',
    fontWeight: '500',
  },
});
