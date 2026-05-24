import { useCurrentUser } from "../../hooks/useAuthQueries";

// useProfileQuery: replaced mock fetchProfile with real `useCurrentUser` hook
// Removed: import from mockSocialApi and direct useQuery here
// Added: delegate to existing auth hook which returns loading/error/data
export function useProfileQuery(options = {}) {
  return useCurrentUser(options);
}
