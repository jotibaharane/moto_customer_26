import * as Yup from 'yup';
export const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  organizationName: Yup.string().when('customerType', {
    is: 'organization',
    then: schema => schema.required('Organization name is required'),
  }),
  organizationType: Yup.string().when('customerType', {
    is: 'organization',
    then: schema => schema.required('Organization type is required'),
  }),
});
