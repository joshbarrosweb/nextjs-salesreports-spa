import * as Yup from 'yup';

const requiredFieldMessage = "Cant be Empty!"
const requiredFieldValidation = Yup.string().trim().required(requiredFieldMessage)

export const validationSchema = Yup.object().shape({
  name: requiredFieldValidation,
  cpf: Yup.string().trim().required(requiredFieldMessage).length(14, "Invalid CPF!"),
  birthdate: Yup.string().trim().required(requiredFieldMessage).length(10, "Invalid date!"),
  address: requiredFieldValidation,
  email:  Yup.string().trim().required(requiredFieldMessage).email("Invalid E-mail!"),
  phone:  requiredFieldValidation,
})
