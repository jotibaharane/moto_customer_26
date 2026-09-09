import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILIES, ms, s, vs} from '@theme/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(18),
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(15),
  },

  vehicleImage: {
    width: '48%',
    height: vs(130),
  },

  infoContainer: {
    marginTop: vs(15),
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: s(8),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  infoRow: {
    minHeight: vs(40),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },

  label: {
    width: '40%',
    paddingHorizontal: s(9),
    fontSize: ms(13),
    color: '#252525',
    fontFamily: FONT_FAMILIES.regular,
  },

  value: {
    flex: 1,
    paddingHorizontal: s(12),
    fontSize: ms(13),
    color: '#252525',
    fontFamily: FONT_FAMILIES.regular,
  },

  dhalaRow: {
    flexDirection: 'row',
    minHeight: vs(65),
  },

  dhalaContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#BDBDBD',
  },

  dhalaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: vs(30),
  },

  dhalaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: vs(30),
  },

  dhalaHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: ms(12),
    color: '#252525',
    fontFamily: FONT_FAMILIES.regular,
  },

  dhalaValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: ms(13),
    color: '#111111',
    fontFamily: FONT_FAMILIES.bold,
  },

  sectionTitle: {
    marginTop: vs(12),
    marginBottom: vs(10),
    fontSize: ms(17),
    color: COLORS.primary[500],
    fontFamily: FONT_FAMILIES.bold,
  },

  listItem: {
    marginBottom: vs(12),
    borderRadius: s(5),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  },

  listImage: {
    width: '100%',
    height: vs(125),
  },

  button: {
    marginVertical: vs(15),
  },
});