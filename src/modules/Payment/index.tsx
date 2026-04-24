import CustomCheckbox from '@components/CustomCheckbox';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const FrightPayment = () => {
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<'Cash' | 'UPI' | 'Scaner'>('Cash');
  return (
    <View
      style={{
        backgroundColor: COLORS.white[100],
        flex: 1,
        padding: fp(16),
        gap: hp(24),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          height: hp(50),
          borderWidth: 0.5,
          borderRadius: 8,
          borderColor: COLORS.gray[200],
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(16),
        }}
      >
        <Text style={{ fontFamily: FONT_FAMILIES.medium, fontSize: fp(16) }}>
          Paid
        </Text>
        <CustomCheckbox value={checked} onValueChange={setChecked} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: hp(50),
          borderWidth: 0.5,
          borderRadius: 8,
          borderColor: COLORS.gray[200],
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(16),
        }}
      >
        <Text style={{ fontFamily: FONT_FAMILIES.medium, fontSize: fp(16) }}>
          To Pay
        </Text>
        <CustomCheckbox value={checked} onValueChange={setChecked} />
      </View>
      <View
        style={{
          backgroundColor: COLORS.primary[300],
          height: hp(56),
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: FONT_FAMILIES.medium,
            color: COLORS.white[100],
            fontSize: fp(16),
            paddingHorizontal: wp(22),
            paddingVertical: hp(18),
          }}
        >
          Total Amount To Be Paid - ₹ 500
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: hp(50),
          borderWidth: 0.5,
          borderRadius: 8,
          borderColor: COLORS.gray[200],
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(16),
        }}
      >
        <Text style={{ fontFamily: FONT_FAMILIES.medium, fontSize: fp(16) }}>
          Pay Another Amount
        </Text>
        <CustomCheckbox value={checked} onValueChange={setChecked} />
      </View>
      <TextInput
        placeholder="Enter Amount You Want To Pay"
        style={{
          marginHorizontal: wp(40),
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          height: 56,
          fontSize: 16,
          color: '#000', // 👈 make sure visible
        }}
        placeholderTextColor={'#999'}
      />
      <View style={{ flexDirection: 'row', gap: wp(16) }}>
        <View
          style={{
            height: hp(28.65),
            borderWidth: 1,
            backgroundColor: tab === 'Cash' ? COLORS.primary[600] : undefined,
            flex: 1,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bold,
              fontSize: fp(16),
              color: tab === 'Cash' ? COLORS.white[100] : COLORS.primary[600],
              textAlign: 'center',
            }}
          >
            Cash
          </Text>
        </View>
        <View
          style={{
            height: hp(28.65),
            borderWidth: 1,
            backgroundColor: tab === 'UPI' ? COLORS.primary[600] : undefined,
            flex: 1,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bold,
              fontSize: fp(16),
              color: tab === 'UPI' ? COLORS.white[100] : COLORS.primary[600],
              textAlign: 'center',
            }}
          >
            UPI
          </Text>
        </View>
        <View
          style={{
            height: hp(28.65),
            borderWidth: 1,
            backgroundColor: tab === 'Scaner' ? COLORS.primary[600] : undefined,
            flex: 1,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILIES.bold,
              fontSize: fp(16),
              color: tab === 'Scaner' ? COLORS.white[100] : COLORS.primary[600],
              textAlign: 'center',
            }}
          >
            Scaner
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FrightPayment;
