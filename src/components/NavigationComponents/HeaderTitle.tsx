import { COLORS, FONT_FAMILIES, fp, wp } from '@theme/index';
import { Text, View } from 'react-native';

const HeaderTitle = ({ title }: { title: string }) => (
  <View style={{ paddingLeft: wp(9) }}>
    <Text
      style={{
        fontSize: fp(20),
        fontFamily: FONT_FAMILIES.semiBold,
        color: COLORS.primary[500],
      }}
    >
      {title}
    </Text>
  </View>
);

export default HeaderTitle;
