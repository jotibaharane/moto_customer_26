import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  IconCube,
  IconHistory,
  IconHome,
  IconTarget,
  IconUserCircle,
} from '@tabler/icons-react-native';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const isFocused = state.index === index;

    const onPress = () => {
      if (!isFocused) navigation.navigate(route.name);
    };

    const getIcon = () => {
      const color = isFocused ? COLORS.primary[500] : COLORS.black[500];

      switch (route.name) {
        case 'Home':
          return <IconHome size={24} color={color} />;
        case 'OPS':
          return <IconTarget size={24} color={color} />;
        case 'New Load':
          return <IconCube size={35} color={COLORS.white[100]} />;
        case 'History':
          return <IconHistory size={24} color={color} />;
        case 'Profile':
          return <IconUserCircle size={24} color={color} />;
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress}>
        <View style={[route?.name === 'New Load' && styles.centerButton]}>
          {getIcon()}
        </View>
        <Text
          style={[
            styles.label,
            {
              fontFamily: isFocused
                ? FONT_FAMILIES.semiBold
                : FONT_FAMILIES.regular,
              color: isFocused ? COLORS.primary[500] : COLORS.black[500],
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return <View style={styles.container}>{state.routes.map(renderTab)}</View>;
};

export default MyTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(80),
    backgroundColor: '#fff',
    elevation: 10,
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    alignItems: 'center',
  },

  side: {
    flexDirection: 'row',
    gap: wp(30),
  },

  tab: {
    alignItems: 'center',
    gap: 4,
  },

  label: {
    fontSize: fp(11),
  },

  /* 🔥 Floating Wrapper */
  centerWrapper: {
    position: 'absolute',
    top: -hp(45),
    left: '50%',
    right: '50%',
    transform: [{ translateX: -wp(32.5) }],
  },

  /* 🔷 Diamond Button */
  centerButton: {
    width: wp(70),
    height: wp(70),
    backgroundColor: COLORS.primary[500],
    borderRadius: fp(18),
    justifyContent: 'center',
    alignItems: 'center',

    transform: [{ rotate: '45deg' }],
    padding: 10,
    marginTop: -hp(50),
    marginBottom: hp(5),
  },

  /* 🔁 Fix content rotation */
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },

  centerText: {
    color: '#fff',
    fontSize: fp(10),
    marginTop: 2,
    fontFamily: FONT_FAMILIES.bold,
  },
});
