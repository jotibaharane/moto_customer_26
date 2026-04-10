import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React from 'react';
import { Modal, Text, View } from 'react-native';

const WaitingDriver = ({ timer = '00:00' }) => {
  return (
    <Modal animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <View
          style={{
            margin: wp(16),
            backgroundColor: COLORS.white[100],
            borderRadius: 16,
            shadowColor: '#000',
            elevation: 5,
            paddingVertical: hp(20),
            paddingHorizontal: wp(14),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.semiBold,
              fontSize: fp(20),
              color: COLORS.primary[500],
              textAlign: 'center',
            }}
          >
            Waiting for Driver ’s{'\n'} Confirmation
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.semiBold,
              fontSize: fp(20),
              color: COLORS.primary[500],
            }}
          >
            {timer}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default WaitingDriver;
