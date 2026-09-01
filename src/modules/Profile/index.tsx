import { useProfileMutation } from '@api/Mutations';
import { signIn } from '@store/slices/Auth/authSlice';
import { COLORS, FONT_FAMILIES } from '@theme/index';
import { Edit } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  // const { ContactNo, CustomerID, EmailID, full_name, CustomerType } =
  //   useSelector((state: RootState) => state.auth);
  const [signUp, { isLoading }] = useProfileMutation();
  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        organization_name:
          values.customer_type === 'organization'
            ? values.organization_name
            : undefined,
        organization_type:
          values.customer_type === 'organization'
            ? values.organization_type
            : undefined,
      };
      const response = await signUp(payload).unwrap();
      if (response.status !== '00') {
        Alert.alert('Error', response?.message || 'Sign up failed');
        return;
      }
      dispatch(signIn(response?.Customer_Details as any));
    } catch (error) {
      console.error('Sign Up Error:', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 35 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILIES.semiBold,
              color: COLORS.primary[500],
            }}
          >
            Profile
          </Text>
          <Edit size={24} color={COLORS.primary[500]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },

  content: {
    flex: 1,
    gap: 24,
  },

  headerWrapper: {
    position: 'relative',
  },

  signUpButton: {
    position: 'absolute',
    top: 84,
    left: 16,
    height: 40,
    width: 122,
    borderRadius: 8,
    backgroundColor: COLORS.white[100],
    borderWidth: 0,
    elevation: 5,
  },

  image: {
    position: 'absolute',
    width: 210,
    height: 150,
    top: 20,
    right: 12,
  },

  toggleContainer: {
    // marginBottom: hp(110),
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  flexBtn: {
    flex: 1,
  },

  continueBtn: {
    marginBottom: 24,
    minWidth: 200,
    alignSelf: 'center',
  },
});
