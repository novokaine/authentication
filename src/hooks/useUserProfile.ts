import { useQuery } from "@tanstack/react-query";
import { profileQueries } from "../api/profile";

export const useUserProfile = () => {
  return useQuery(profileQueries.current());
};
