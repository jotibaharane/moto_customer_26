
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import {
  IconAt,
  IconChevronDown,
  IconChevronUp,
  IconHome,
  IconHistory,
  IconUserCircle,
  IconTruck,
  IconCreditCard,
  IconTruckDelivery,
  IconReportAnalytics,
} from '@tabler/icons-react-native';

import {
  COLORS,
  FONT_FAMILIES,
  fp,
  hp,
  wp,
} from '@theme/index';

const OPS_OPTIONS = [
  {
    id: 'booking',
    title: 'Veh Booking',
    icon: IconTruck,
  },
  {
    id: 'payment',
    title: 'Pay & Delivery',
    icon: IconCreditCard,
  },
  {
    id: 'cancel',
    title: 'Cancel Ship',
    icon: IconTruckDelivery,
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: IconReportAnalytics,
  },
];

const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [opsVisible, setOpsVisible] = useState(false);

  const currentRoute = state.routes[state.index];
  const isHomeScreen = currentRoute?.name === 'Home';

  // Close OPS menu whenever user leaves Home.
  useEffect(() => {
    if (!isHomeScreen) {
      setOpsVisible(false);
    }
  }, [isHomeScreen]);

  const handleTabPress = (route: any, isFocused: boolean) => {
    if (route.name === 'OPS') {
      // OPS menu is available only on Home.
      if (!isHomeScreen) {
        return;
      }

      setOpsVisible(prev => !prev);
      return;
    }

    setOpsVisible(false);

    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  const handleOpsOption = (option: string) => {
    setOpsVisible(false);

    // Add your navigation or API actions here.
    // Example:
    // if (option === 'booking') {
    //   navigation.navigate('VehicleBooking');
    // }
  };

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];

    const label =
      options.tabBarLabel ?? options.title ?? route.name;

    const isFocused = state.index === index;
    const isOps = route.name === 'OPS';
    const isNewLoad = route.name === 'Find Veh';

    const color = isFocused
      ? COLORS.primary[500]
      : '#21104D';

    const renderIcon = () => {
      switch (route.name) {
        case 'Home':
          return <IconHome size={27} color={color} />;

        case 'OPS':
          return <IconAt size={30} color={color} />;

        case 'Find Veh':
          return (
            <View style={styles.centerButton}>
              <View style={styles.centerIcon}>
                <IconTruck
                  size={35}
                  color={COLORS.white[100]}
                />
              </View>
            </View>
          );

        case 'History':
          return <IconHistory size={30} color={color} />;

        case 'Profile':
          return <IconUserCircle size={30} color={color} />;

        default:
          return null;
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        activeOpacity={0.8}
        style={styles.tab}
        onPress={() => handleTabPress(route, isFocused)}
      >
        {renderIcon()}

        <Text
          style={[
            styles.label,
            {
              fontFamily: isFocused
                ? FONT_FAMILIES.semiBold
                : FONT_FAMILIES.regular,
              color,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>

      {/* OPS EXPANDED MENU */}
      {opsVisible && isHomeScreen && (
        <View style={styles.opsContainer}>

          {/* OPS HEADER */}
          <View style={styles.opsHeader}>
            <View style={styles.opsHeaderLeft}>
              <IconAt
                size={30}
                color={COLORS.primary[500]}
              />

              <Text style={styles.opsTitle}>OPS</Text>
            </View>

            <TouchableOpacity
              onPress={() => setOpsVisible(false)}
              hitSlop={12}
            >
              <IconChevronDown
                size={29}
                color={COLORS.primary[500]}
              />
            </TouchableOpacity>
          </View>

          {/* OPS MENU GRID */}
          <View style={styles.opsGrid}>
            {OPS_OPTIONS.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={styles.opsButton}
                onPress={() => handleOpsOption(item.id)}
              >
                <Text style={styles.opsButtonText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Empty spaces to maintain screenshot layout */}
            <View style={styles.emptyButton} />
            <View style={styles.emptyButton} />
          </View>
        </View>
      )}

      {/* BOTTOM NAVIGATION */}
      <View style={styles.container}>
        {state.routes.map(renderTab)}
      </View>

    </View>
  );
};

export default MyTabBar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },

  // OPS MENU
  opsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    paddingBottom: hp(15),
    borderTopWidth: 0.5,
    borderTopColor: '#EEEEEE',
  },

  opsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(25),
    paddingHorizontal: wp(2),
  },

  opsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(25),
  },

  opsTitle: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(19),
    color: COLORS.primary[500],
  },

  opsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(12),
  },

  opsButton: {
    width: '31.5%',
    height: hp(52),
    borderRadius: hp(18),
    backgroundColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  opsButtonText: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: fp(14),
    color: '#000000',
    textAlign: 'center',
  },

  emptyButton: {
    width: '31.5%',
    height: hp(52),
    borderRadius: hp(18),
    backgroundColor: '#E2E2E2',
  },

  // BOTTOM TAB BAR
  container: {
    flexDirection: 'row',
    height: hp(80),
    backgroundColor: '#FFFFFF',
    elevation: 10,
    justifyContent: 'space-between',
    paddingHorizontal: wp(15),
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#EEEEEE',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(4),
  },

  label: {
    fontSize: fp(14),
  },

  // CENTER FLOATING BUTTON
  centerButton: {
    width: wp(70),
    height: wp(70),
    backgroundColor: COLORS.primary[500],
    borderRadius: fp(18),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    marginTop: -hp(45),
    marginBottom: hp(5),
  },

  centerIcon: {
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
