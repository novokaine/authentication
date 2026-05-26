import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginValidationSchema } from "./validation";
import { useMutation } from "@tanstack/react-query";

type LoginCredentials = {
  userName: string;
  password: string;
};
export const useLogin = () => {
  const methods = useForm<LoginCredentials>({
    defaultValues: {
      userName: "",
      password: ""
    },
    resolver: yupResolver(loginValidationSchema),
    mode: "onTouched"
  });

  const mutation = useMutation({
    mutationFn: ({ userName, password }: LoginCredentials) => {
      return fetch("http://localhost:3001/api/login", {
        method: "POST",
        body: JSON.stringify({ username: userName, password })
      });
    },
    onSuccess: () => console.log("success"),
    onError: (err) => console.log(err)
  });

  const onSubmit: SubmitHandler<LoginCredentials> = (formValues) => {
    mutation.mutate({
      userName: formValues.userName,
      password: formValues.password
    });
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit)
  };
};
