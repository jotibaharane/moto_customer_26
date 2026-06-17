import { RadioButtonProps } from '@components/RadioButton';
export const MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoicmFtZXNobW90byIsImEiOiJjbWt4c2swb2QwYzA1M2Nxemg2MzZjZG5jIn0.r9DupyA23H--LeacRtBXKA"
export const OTP_TIME = 120;
export const Languges: RadioButtonProps[] = [
  {
    id: 'en',
    label: 'English',
    value: 'en',
  },
  {
    id: 'mr',
    label: 'Marathi',
    value: 'mr',
  },
  {
    id: 'hi',
    label: 'Hindi',
    value: 'hi',
  },
  {
    id: 'gu',
    label: 'Gujarati',
    value: 'gu',
  },
  {
    id: 'bn',
    label: 'Bengali',
    value: 'bn',
  },
  {
    id: 'te',
    label: 'Telugu',
    value: 'te',
  },
  {
    id: 'kn',
    label: 'Kannada',
    value: 'kn',
  },
];

export const companyTypedata = [
  'OWENER/INDIVIDUAL',
  'PROPRIETORSHIP',
  'CHALAK MALAK',
  'PARTNERSHIP',
  'PVT LTD',
  'LLP',

  // 'INDIVIDUAL',
].map(v => ({ label: v, value: v }));

export const bookmarkData = [
  { bookmark: 'Office' },
  { bookmark: 'Home' },
  { bookmark: 'Factory' },
  { bookmark: 'warehouse' },
  { bookmark: '+Add New' },
];
