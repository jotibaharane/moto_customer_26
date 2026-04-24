import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    padding: fp(16),
  },

  /* ================= VEHICLE IMAGES ================= */
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(29),
  },

  vehicleImage: {
    width: wp(150),
    height: wp(150),
  },

  vehicleImageMirror: {
    width: wp(150),
    height: wp(150),
    transform: [{ scaleX: -1 }],
  },

  /* ================= VEHICLE INFO ================= */
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(4),
  },

  vehicleName: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleDetails: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[250],
    paddingBottom: hp(24),
  },

  /* ================= TITLE ================= */
  sectionTitle: {
    fontSize: fp(20),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
    marginTop: hp(27),
  },

  /* ================= LIST ================= */
  listItem: {
    flex: 1,
    marginBottom: hp(16),
  },

  listImage: {
    width: '100%',
    height: hp(146),
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: hp(15),
  },
});
