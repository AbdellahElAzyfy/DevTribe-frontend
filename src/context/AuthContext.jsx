import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  configureAuthService,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
  register as registerRequest,
} from "../services/apiAuth";
import { connectSocket, disconnectSocket } from "../services/socketClient";
import { queryClient } from "../lib/queryClient";
import AuthContext from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const setAccessToken = useCallback((nextToken) => {
    if (nextToken) {
      setAccessTokenState(nextToken);
      return;
    }

    setAccessTokenState(null);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, [setAccessToken]);

  const fetchMe = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const result = await loginRequest(credentials);
      setAccessToken(result.accessToken);

      const nextUser = result.user ?? (await fetchMe());
      setUser(nextUser);
      setAuthChecked(true);

      return nextUser;
    },
    [fetchMe, setAccessToken],
  );

  const register = useCallback(
    async (payload) => {
      const result = await registerRequest(payload);
      setAccessToken(result.accessToken);

      const nextUser = result.user ?? (await fetchMe());
      setUser(nextUser);
      setAuthChecked(true);

      return nextUser;
    },
    [fetchMe, setAccessToken],
  );

  const refresh = useCallback(async () => {
    const result = await refreshSession();
    setAccessToken(result.accessToken);
    return result;
  }, [setAccessToken]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      setAuthChecked(true);
      queryClient.clear();
    }
  }, [clearSession]);

  useEffect(() => {
    configureAuthService({
      getToken: () => tokenRef.current,
      setToken: (nextToken) => setAccessToken(nextToken),
      handleUnauthorized: () => {
        clearSession();
        setAuthChecked(true);
        queryClient.clear();
      },
    });
  }, [clearSession, setAccessToken]);

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
    } else {
      disconnectSocket();
    }
  }, [accessToken]);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      try {
        await refresh();
        await fetchMe();
      } catch {
        clearSession();
      } finally {
        if (active) {
          setAuthChecked(true);
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, [clearSession, fetchMe, refresh]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      authChecked,
      isBootstrapping,
      login,
      register,
      refresh,
      fetchMe,
      logout,
      clearSession,
      setAccessToken,
    }),
    [
      accessToken,
      authChecked,
      clearSession,
      fetchMe,
      isBootstrapping,
      login,
      logout,
      refresh,
      register,
      setAccessToken,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
