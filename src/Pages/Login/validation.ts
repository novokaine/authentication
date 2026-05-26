import * as yup from "yup";
export const loginValidationSchema = yup
  .object()
  .shape({
    userName: yup.string().required("Username is a required field"),
    password: yup.string().required("Password is a required field")
  })
  .required();
