import * as Yup from 'yup';
export const SignUpSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter valid 10 digit mobile number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  organization_name: Yup.string().when('type', {
    is: 'organization',
    then: schema => schema.required('Organization name is required'),
  }),
  organization_type: Yup.string().when('type', {
    is: 'organization',
    then: schema => schema.required('Organization type is required'),
  }),
});
