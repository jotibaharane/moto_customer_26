import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { Clock, Home, Package, Plus, Target, User } from 'lucide-react-native';
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
          return <Home size={24} color={color} />;
        case 'OPS':
          return <Target size={24} color={color} />;
        case 'History':
          return <Clock size={24} color={color} />;
        case 'Profile':
          return <User size={24} color={color} />;
        default:
          return null;
      }
    };

    // ❌ Skip center tab from normal rendering
    if (route.name === 'New Load') return null;

    return (
      <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress}>
        {getIcon()}
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

  return (
    <View style={styles.container}>
      {/* LEFT TABS */}
      <View style={styles.side}>{state.routes.slice(0, 2).map(renderTab)}</View>

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.centerWrapper}
        onPress={() => navigation.navigate('New Load')}
      >
        <View style={styles.centerButton}>
          <View style={styles.innerContent}>
            <Package size={32} color="#fff" />
            <Plus size={14} color="#fff" style={{ marginTop: 2 }} />
            <Text style={styles.centerText} numberOfLines={1}>
              New Load
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* RIGHT TABS */}
      <View style={styles.side}>{state.routes.slice(3).map(renderTab)}</View>
    </View>
  );
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
    width: wp(90),
    height: wp(90),
    backgroundColor: COLORS.primary[500],
    borderRadius: fp(18),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    transform: [{ rotate: '45deg' }],
    padding: 10,
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
