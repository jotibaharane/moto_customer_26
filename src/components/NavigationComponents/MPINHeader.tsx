import { COLORS, FONT_FAMILIES, fp } from '@theme/index';
import { Text, View } from 'react-native';

const MPINHeader = ({ subtitle }: { subtitle: string }) => (
  <View style={{ alignItems: 'center' }}>
    <Text
      style={{
        fontSize: fp(20),
        fontFamily: FONT_FAMILIES.semiBold,
        color: COLORS.primary[500],
      }}
    >
      Set New MPIN
    </Text>
    <Text
      style={{
        fontSize: fp(12),
        fontFamily: FONT_FAMILIES.regular,
        color: COLORS.gray[600],
      }}
    >
      {subtitle}
    </Text>
  </View>
);

export default MPINHeader;
