import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  client:  Yup.object().nullable(true).required('This field cannot be empty.'),
  items: Yup.array().min(1, "Should contain at least 1 product."),
  paymentForm: Yup.string().trim().required('This field cannot be empty.')
})
