import Wave from '@assets/Svg/Wave';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import { hp } from '@theme/index';
import React from 'react';
import { Alert, Image, StatusBar, View } from 'react-native';
import { styles } from './SignUp.style';

import { useOnboardingMutation } from '@api/Mutations';
import { OnboardingRequest } from '@api/type';
import Dropdown from '@components/Dropdown';
import { useRoute } from '@react-navigation/native';
import { isProfileCompleted } from '@store/slices/Auth/authSlice';
import { companyTypedata } from '@utils/constants';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
    <>
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
              <View style={styles.headerWrapper}>
                <Wave width={'100%'} height={hp(235)} />

                <CustomButton
                  title="SIGN UP"
                  variant="outline"
                  style={styles.signUpButton}
                  onPress={() => {}}
                />

                <Image
                  source={require('@assets/images/signUpCar.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.content}>
                {/* Full Name */}
                <InputOutline
                  placeholder="Full Name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  error={errors?.fullName}
                />

                {/* Mobile */}
                <InputOutline
                  placeholder="Mobile Number"
                  value={values.mobile}
                  keyboardType="numeric"
                  onChangeText={handleChange('mobile')}
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
                {values.customerType !== 'individual' && (
                  <>
                    <InputOutline
                      placeholder="Organization Name"
                      value={values.organizationName}
                      onChangeText={handleChange('organizationName')}
                      error={errors?.organizationName}
                    />

                    <Dropdown
                      label="Organization Type"
                      data={companyTypedata}
                      onChange={value =>
                        setFieldValue('organizationType', value)
                      }
                      value={values.organizationType}
                      error={errors?.organizationType}
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
                  style={styles.continueBtn}
                  onPress={handleSubmit as any}
                  loading={isLoading}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </>
  );
};

export default SignUpScreen;
