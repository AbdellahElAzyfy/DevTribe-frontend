import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let getAccessToken = () => null;
let setAccessToken = () => {};
let onUnauthorized = () => {};
let refreshPromise = null;

function isAuthRefreshPath(url = "") {
  return url.includes("/auth/refresh");
}

function isRetryable401(error) {
  const status = error?.response?.status;
  const url = error?.config?.url || "";

  if (status !== 401) {
    return false;
  }

  if (isAuthRefreshPath(url)) {
    return false;
  }

  return true;
}

function getTokenFromPayload(payload) {
  return (
    payload?.accessToken ??
    payload?.token ??
    payload?.jwt ??
    payload?.data?.accessToken ??
    null
  );
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then((response) => {
        const nextToken = getTokenFromPayload(response.data);

        if (!nextToken) {
          throw new Error("Refresh response did not include an access token.");
        }

        setAccessToken(nextToken);
        return nextToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!originalRequest || !isRetryable401(error) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      onUnauthorized();
      return Promise.reject(refreshError);
    }
  },
);

export function configureApiClientAuth({
  getToken,
  setToken,
  handleUnauthorized,
} = {}) {
  if (typeof getToken === "function") {
    getAccessToken = getToken;
  }

  if (typeof setToken === "function") {
    setAccessToken = setToken;
  }

  if (typeof handleUnauthorized === "function") {
    onUnauthorized = handleUnauthorized;
  }
}

export default apiClient;
