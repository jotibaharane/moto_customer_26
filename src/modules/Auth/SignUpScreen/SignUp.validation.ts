import * as Yup from 'yup';
export const SignUpSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
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
