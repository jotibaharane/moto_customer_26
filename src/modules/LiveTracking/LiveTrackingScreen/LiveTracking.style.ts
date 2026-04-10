import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },

  postId: {
    fontSize: 14,
    color: '#1e3a8a',
  },

  date: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  list: {
    marginTop: 20,
    paddingBottom: 40,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  time: {
    width: 80,
    fontSize: 12,
    color: '#555',
  },

  timeline: {
    width: 30,
    alignItems: 'center',
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1e3a8a',
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#ccc',
    marginTop: 2,
  },

  title: {
    flex: 1,
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
  },
});
