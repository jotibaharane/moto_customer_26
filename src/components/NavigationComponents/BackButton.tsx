import { COLORS, fp, wp } from '@theme/index';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const BackButton = ({ navigation }: any) => (
  <TouchableOpacity
    onPress={navigation.goBack}
    style={{
      backgroundColor: COLORS.gray[75],
      borderRadius: fp(30),
      padding: fp(11),
      height: fp(42),
      width: fp(42),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(10),
    }}
  >
    <ChevronLeft size={24} color={COLORS.black[500]} />
  </TouchableOpacity>
);

export default BackButton;
