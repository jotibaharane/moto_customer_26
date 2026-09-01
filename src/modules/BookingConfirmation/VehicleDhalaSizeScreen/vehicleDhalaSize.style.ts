/* ========================================================================== */
/* vehicleDhalaSize.style.ts                                                  */
/* ========================================================================== */

import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* ======================================================================== */
  /* CONTAINER                                                                */
  /* ======================================================================== */

  container: {
    flex: 1,
    backgroundColor: COLORS.white[100],
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },

  /* ======================================================================== */
  /* VEHICLE TYPE IMAGES                                                      */
  /* ======================================================================== */

  imageRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(16),
  },

  vehicleImageContainer: {
    flex: 1,
    height: vs(150),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  vehicleImage: {
    width: '100%',
    height: '100%',
  },

  vehicleImageMirror: {
    width: '100%',
    height: '100%',
    transform: [{ scaleX: -1 }],
  },

  /* ======================================================================== */
  /* VEHICLE INFORMATION                                                      */
  /* ======================================================================== */

  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: vs(4),
    marginTop: vs(8),
  },

  vehicleName: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.black[500],
    textAlign: 'center',
  },

  vehicleDetails: {
    fontSize: ms(16),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
    textAlign: 'center',

    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[250],

    paddingBottom: vs(24),
  },

  /* ======================================================================== */
  /* TITLE                                                                    */
  /* ======================================================================== */

  sectionTitle: {
    marginTop: vs(20),
    marginBottom: vs(12),

    fontSize: ms(20),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  /* ======================================================================== */
  /* FLATLIST                                                                 */
  /* ======================================================================== */

  list: {
    flex: 1,
    width: '100%',
  },

  listContentContainer: {
    width: '100%',
    paddingBottom: vs(20),
  },

  /* ======================================================================== */
  /* REAL IMAGE CARD                                                          */
  /* ======================================================================== */

  listItem: {
    width: '100%',
    height: vs(180),

    borderRadius: s(10),

    overflow: 'hidden',

    backgroundColor: COLORS.gray[100],
  },

  listImage: {
    width: '100%',
    height: '100%',
  },

  /* ======================================================================== */
  /* EMPTY STATE                                                              */
  /* ======================================================================== */

  emptyContainer: {
    width: '100%',
    height: vs(150),

    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  /* ======================================================================== */
  /* BUTTON                                                                   */
  /* ======================================================================== */

  button: {
    marginTop: vs(12),
    marginBottom: vs(8),
  },
});
