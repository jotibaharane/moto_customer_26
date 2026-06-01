import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: 16,
  },

  /* ================= VEHICLE IMAGES ================= */
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 29,
  },

  vehicleImage: {
    width: 150,
    height: 150,
  },

  vehicleImageMirror: {
    width: 150,
    height: 150,
    transform: [{ scaleX: -1 }],
  },

  /* ================= VEHICLE INFO ================= */
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  vehicleName: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleDetails: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[250],
    paddingBottom: 24,
  },

  /* ================= TITLE ================= */
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
    marginTop: 27,
  },

  /* ================= LIST ================= */
  listItem: {
    flex: 1,
    marginBottom: 16,
  },

  listImage: {
    width: '100%',
    height: 146,
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: 15,
  },
});
