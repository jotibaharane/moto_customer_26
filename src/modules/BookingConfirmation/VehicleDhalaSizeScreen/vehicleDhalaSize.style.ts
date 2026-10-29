
import { StyleSheet } from 'react-native';
import { vs } from '@theme/New';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: vs(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '700',
    color: '#365582',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexGrow: 1,
  },
  vehicleNumber: {
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  vehicleImageContainer: {
    width: '48%',
    height: vs(112),
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#777777',
    fontSize: 12,
  },
  detailsTable: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  tableRow: {
    minHeight: vs(38),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    width: '39%',
    justifyContent: 'center',
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: '#C8C8C8',
  },
  tableValue: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  tableText: {
    fontSize: 12,
    color: '#292929',
  },
  dimensionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  dimensionColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#C8C8C8',
  },
  dimensionHeading: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 4,
  },
  dimensionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 12,
  },
  listItem: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: vs(200),
    backgroundColor: '#F7F7F7',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#777777',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '100%',
  },
});
