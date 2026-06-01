import { useProfileMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import Dropdown from '@components/Dropdown';
import { InputOutline } from '@components/Input';
import { SignUpSchema } from '@modules/Auth/SignUpScreen/SignUp.validation';
import { RootState } from '@store/rootReducer';
import { signIn } from '@store/slices/Auth/authSlice';
import { COLORS, FONT_FAMILIES } from '@theme/index';
import { companyTypedata } from '@utils/constants';
import { Formik } from 'formik';
import { Edit } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  const { ContactNo, CustomerID, EmailID, full_name, CustomerType } =
    useSelector((state: RootState) => state.auth);
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
      <Formik
        initialValues={{
          full_name: full_name,
          ContactNo: ContactNo,
          email: EmailID,
          customer_type: 'individual',
          organization_name: '',
          organization_type: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => (
          <KeyboardAwareScrollView scrollEnabled>
            <View style={styles.constainer}>
              <View style={styles.content}>
                {/* Full Name */}
                <InputOutline
                  placeholder="Full Name"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  error={errors?.full_name}
                />

                {/* Mobile */}
                <InputOutline
                  placeholder="Mobile Number"
                  value={values.ContactNo}
                  keyboardType="numeric"
                  onChangeText={handleChange('ContactNo')}
                  editable={false}
                />

                {/* Email */}
                <InputOutline
                  placeholder="Email id"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={errors?.email}
                />

                {/* Toggle */}
                {values.customer_type !== 'individual' && (
                  <>
                    <InputOutline
                      placeholder="Organization Name"
                      value={values.organization_name}
                      onChangeText={handleChange('organization_name')}
                      error={errors?.organization_name}
                    />

                    <Dropdown
                      label="Organization Type"
                      data={companyTypedata}
                      onChange={value =>
                        setFieldValue('organization_type', value)
                      }
                      value={values.organization_type}
                      error={errors?.organization_type}
                    />
                  </>
                )}

                <View style={{ flex: 1 }} />

                {/* Continue */}
                <CustomButton
                  title="Submit"
                  variant="filled"
                  style={styles.continueBtn}
                  onPress={handleSubmit as any}
                  loading={isLoading}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
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
