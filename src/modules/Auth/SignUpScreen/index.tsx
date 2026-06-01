import Wave from '@assets/Svg/Wave';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import { hp } from '@theme/index';
import React from 'react';
import { Alert, Image, StatusBar, View } from 'react-native';
import { styles } from './SignUp.style';

import { useOnboardingMutation } from '@api/Mutations';
import Dropdown from '@components/Dropdown';
import { useRoute } from '@react-navigation/native';
import { signIn } from '@store/slices/Auth/authSlice';
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
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Formik
        initialValues={{
          full_name: '',
          ContactNo: route.params?.mobile || '',
          email: '',
          customer_type: 'individual',
          organization_name: '',
          organization_type: '',
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
                <View style={styles.toggleContainer}>
                  <CustomButton
                    title="Individual"
                    style={styles.flexBtn}
                    variant={
                      values.customer_type === 'individual'
                        ? 'filled'
                        : 'outline'
                    }
                    onPress={() => setFieldValue('customer_type', 'individual')}
                  />
                  <CustomButton
                    title="Organization"
                    variant={
                      values.customer_type !== 'individual'
                        ? 'filled'
                        : 'outline'
                    }
                    style={styles.flexBtn}
                    onPress={() =>
                      setFieldValue('customer_type', 'organization')
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
