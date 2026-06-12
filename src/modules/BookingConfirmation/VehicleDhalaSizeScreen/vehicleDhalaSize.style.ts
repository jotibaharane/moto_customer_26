import { COLORS, FONT_FAMILIES, s, vs } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: s(16),
  },

  /* ================= VEHICLE IMAGES ================= */
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(29),
  },

  vehicleImage: {
    width: s(150),
    height: s(150),
  },

  vehicleImageMirror: {
    width: s(150),
    height: s(150),
    transform: [{ scaleX: -1 }],
  },

  /* ================= VEHICLE INFO ================= */
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: vs(4),
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

    paddingBottom: vs(24),
  },

  /* ================= TITLE ================= */
  sectionTitle: {
    marginTop: vs(27),

    fontSize: 20,
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  /* ================= LIST ================= */
  listItem: {
    flex: 1,
    marginBottom: vs(16),
  },

  listImage: {
    width: '100%',
    height: vs(146),
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: vs(15),
  },
});
