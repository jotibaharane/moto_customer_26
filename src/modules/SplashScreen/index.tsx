import Splash from '@assets/Svg/Splash';
import { COLORS } from '@theme/index';
import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './splash.style';
const SplashScreen = () => {
  // const dispatch = useDispatch();
  // const driver = useSelector((state: RootState) => state.auth);

  // useEffect(() => {
  //   console.log({ driver });
  //   const timer = setTimeout(() => {
  //     if (driver?.isLogin) {
  //       navigate('App');
  //     } else {
  //       if (driver?.isProfileCompleted) {
  //         if (driver?.isMPINSet) {
  //           navigate('Auth', { screen: ROUTES.MPIN_LOGIN });
  //         } else {
  //           dispatch(login());
  //         }
  //       } else {
  //         navigate('Auth');
  //       }
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [driver]);
  return (
    <LinearGradient
      colors={[COLORS.primary[300], COLORS.primary[500]]}
      style={styles.container}
    >
      <Splash />
      <Text style={styles.text}>ABC Company</Text>
    </LinearGradient>
  );
};

export default SplashScreen;
