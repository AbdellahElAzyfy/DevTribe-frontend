import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import * as apiUsers from "../services/apiUsers";

export const useUserProfile = (username) => {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: () => apiUsers.getUserByUsername(username),
    enabled: !!username,
  });
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => apiUsers.getUserById(userId),
    enabled: !!userId,
  });
};
