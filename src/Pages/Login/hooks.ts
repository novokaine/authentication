import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  authMutations,
  authQueryKeys,
  type ILoginCredentials
} from "../../api/auth";
import { ApiError } from "../../api/httpClient";
import { loginValidationSchema } from "./validation";

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Unable to sign in. Please check your credentials and try again.";
};

const getRedirectPath = (state: unknown) => {
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    state.from &&
    typeof state.from === "object" &&
    "pathname" in state.from &&
    typeof state.from.pathname === "string"
  ) {
    return state.from.pathname;
  }

  return "/dashboard";
};

export const useLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const methods = useForm<ILoginCredentials>({
    defaultValues: {
      userName: "",
      password: ""
    },
    resolver: yupResolver(loginValidationSchema),
    mode: "onTouched"
  });

  const loginMutation = useMutation({
    ...authMutations.login(),
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKeys.session(), session);
      void navigate(getRedirectPath(location.state), { replace: true });
    }
  });

  const onSubmit: SubmitHandler<ILoginCredentials> = ({
    userName,
    password
  }) => {
    loginMutation.mutate({ userName, password });
  };

  return {
    errorMessage: loginMutation.error
      ? getLoginErrorMessage(loginMutation.error)
      : null,
    isSubmitting: loginMutation.isPending,
    methods,
    onSubmit: methods.handleSubmit(onSubmit)
  };
};
