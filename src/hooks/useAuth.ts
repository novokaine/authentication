import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authMutations, authQueries, authQueryKeys } from "../api/auth";
import { profileQueryKeys } from "../api/profile";

export const useAuthSession = () => {
  return useQuery(authQueries.session());
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    ...authMutations.logout(),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      queryClient.removeQueries({ queryKey: profileQueryKeys.all });
      void navigate("/login", { replace: true });
    }
  });
};
