import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import React from 'react';
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './SignUp.style';

import { useOnboardingMutation } from '@api/Mutations';
import { OnboardingRequest } from '@api/type';
import Dropdown from '@components/Dropdown';
import { goBack } from '@navigation/NavigationService';
import { useRoute } from '@react-navigation/native';
import { isProfileCompleted } from '@store/slices/Auth/authSlice';
import { FONT_FAMILIES } from '@theme/index';
import { ms, vs } from '@theme/scaling-utils';
import { companyTypedata } from '@utils/constants';
import { Formik } from 'formik';
import { ArrowLeft } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { SignUpSchema } from './SignUp.validation';
const SignUpScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const [signUp, { isLoading }] = useOnboardingMutation();
  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        organizationName:
          values.customerType === 'organization'
            ? values.organizationName
            : undefined,
        organizationType:
          values.customerType === 'organization'
            ? values.organizationType
            : undefined,
      };
      const response = await signUp(payload).unwrap();
      if (response.status !== '00') {
        Alert.alert('Error', response?.message || 'Sign up failed');
        return;
      }
      dispatch(isProfileCompleted(true));
    } catch (error) {
      console.error('Sign Up Error:', error);
    }
  };
  return (
    <SafeAreaView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Formik<OnboardingRequest>
        initialValues={{
          fullName: '',
          mobile: route.params?.mobile || '',
          email: '',
          customerType: 'individual',
          organizationName: '',
          organizationType: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
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
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: vs(4),
                  marginTop: vs(68),
                  marginHorizontal: 24,
                }}
                onPress={() => goBack()}
              >
                <ArrowLeft size={24} />
                <Text
                  style={{
                    fontSize: ms(20),
                    fontFamily: FONT_FAMILIES.semiBold,
                  }}
                >
                  SIGN UP
                </Text>
              </TouchableOpacity>

              <View style={styles.content}>
                {/* Full Name */}
                <InputOutline
                  placeholder="Full Name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  error={errors?.fullName}
                  style={{ backgroundColor: 'transparent' }}
                  placeStyle={{ backgroundColor: 'transparent' }}
                />

                {/* Mobile */}
                <InputOutline
                  placeholder="Mobile Number"
                  value={values.mobile}
                  keyboardType="numeric"
                  onChangeText={handleChange('mobile')}
                  editable={false}
                  style={{ backgroundColor: 'transparent' }}
                  placeStyle={{ backgroundColor: 'transparent' }}
                />

                {/* Email */}
                <InputOutline
                  placeholder="Email id"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={errors?.email}
                  style={{ backgroundColor: 'transparent' }}
                  placeStyle={{ backgroundColor: 'transparent' }}
                />

                {/* Toggle */}
                {values.customerType !== 'individual' && (
                  <>
                    <InputOutline
                      placeholder="Organization Name"
                      value={values.organizationName}
                      onChangeText={handleChange('organizationName')}
                      error={errors?.organizationName}
                      style={{ backgroundColor: 'transparent' }}
                      placeStyle={{ backgroundColor: 'transparent' }}
                    />

                    <Dropdown
                      label="Organization Type"
                      data={companyTypedata}
                      onChange={value =>
                        setFieldValue('organizationType', value)
                      }
                      value={values.organizationType}
                      inputeStyle={{ backgroundColor: 'transparent' }}
                    />
                  </>
                )}
                <View style={styles.toggleContainer}>
                  <CustomButton
                    title="Individual"
                    style={styles.flexBtn}
                    variant={
                      values.customerType === 'individual'
                        ? 'filled'
                        : 'outline'
                    }
                    onPress={() => setFieldValue('customerType', 'individual')}
                  />
                  <CustomButton
                    title="Organization"
                    variant={
                      values.customerType !== 'individual'
                        ? 'filled'
                        : 'outline'
                    }
                    style={styles.flexBtn}
                    onPress={() =>
                      setFieldValue('customerType', 'organization')
                    }
                  />
                </View>
                <View style={{ flex: 1 }} />

                {/* Continue */}
                <CustomButton
                  title="Continue"
                  variant="filled"
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

export default SignUpScreen;
