import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  column: {
    width: '48%',
  },

  label: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    width: '100%',
    height: '55%',
    backgroundColor: '#fff',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    overflow: 'hidden',
  },

  header: {
    minHeight: 60,
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#315E9F',
  },

 closeButton: {
    width: 35,
    height: 35,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadge: {
    backgroundColor: '#1475B9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },

   statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // =========================
  // COMMON
  // =========================

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  loadPostId: {
    color: '#315E9F',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 10,
  },

   reportedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },

  radioCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
  },

  disabledText: {
    color: '#b5b5b5',
    fontSize: 17,
    fontWeight: '600',
  },

  reportedMessage: {
    flexDirection: 'row',
    marginTop: 25,
  },

  bullet: {
    fontSize: 22,
    marginRight: 8,
  },

  reportedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  // =========================
  // LOADING
  // =========================

  loadingContainer: {
    flex: 1,
    paddingHorizontal: 18,
  },

  loadingInfo: {
    alignItems: 'center',
    marginTop: 5,
  },

  loadingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  timer: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginTop: 3,
  },

  loadingStages: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 22,
  },

  stage: {
    alignItems: 'center',
  },

  stageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
    marginBottom: 12,
  },

  imagePlaceholder: {
    width: 112,
    height: 101,
    borderWidth: 1,
    borderColor: '#c8c8c8',

    alignItems: 'center',
    justifyContent: 'center',
  },

  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  packageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginRight: 10,
  },

  packageInput: {
    width: 94,
    height: 38,

    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 7,

    textAlign: 'center',

    color: '#315E9F',
    fontSize: 16,

    paddingVertical: 0,
  },

  // =========================
  // PAYMENT RECEIPT
  // =========================

   receiptScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  receiptContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  receiptIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  receiptTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },

  receiptStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E8B57',
    textTransform: 'uppercase',
  },

receiptCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
},
download: {
  width: 362,
  height: 50,
  borderRadius:10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:'#2E5A99'
},
 sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 12,
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingVertical: 9,
  },

  receiptLabel: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },

  receiptValue: {
    flex: 1,

    textAlign: 'right',

    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },

  boldText: {
    fontWeight: '700',
    color: '#000000',
  },

  // Footer
  receiptFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingVertical: 12,
  },

  footerText: {
    fontSize: 13,
    color: '#555555',
    marginLeft: 8,
  },
  locationRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginTop: 12,
},

locationIcon: {
  width: 32,
  alignItems: 'center',
},

locationContent: {
  flex: 1,
  paddingLeft: 8,
},

locationLabel: {
  fontSize: 13,
  color: '#777',
  marginBottom: 4,
},

locationText: {
  fontSize: 15,
  color: '#222',
  fontWeight: '500',
  lineHeight: 21,
},

routeLine: {
  width: 1,
  height: 20,
  backgroundColor: '#D0D0D0',
  marginLeft: 16,
  marginVertical: 2,
},

ratingContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  borderWidth: 1,
  borderColor: '#E8E8E8',
  borderRadius: 10,
},

starsContainer: {
//   borderWidth:1,
// paddingLeft:50,
// paddingRight:50,
  flexDirection: 'row',
  gap: 8,
  marginBottom: 10,
},

ratingText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#315E9F',
},
});