import apiClient, { configureApiClientAuth } from "./apiClient";

function getErrorMessage(payload, fallback) {
  return (
    payload?.message ||
    payload?.error ||
    payload?.detail ||
    fallback ||
    "Something went wrong."
  );
}

function createAuthError(message, status, payload) {
  const error = new Error(message);
  error.status = status;
  error.payload = payload;
  return error;
}

function normalizeAuthResult(payload) {
  const accessToken =
    payload?.accessToken ?? payload?.token ?? payload?.jwt ?? null;
  const user = payload?.user ?? payload?.data?.user ?? null;

  return {
    accessToken,
    user,
    raw: payload,
  };
}

function mapAuthError(error) {
  const payload = error?.response?.data ?? null;
  const status = error?.response?.status ?? 500;
  const fallback = error?.message ?? "Request failed.";

  return createAuthError(getErrorMessage(payload, fallback), status, payload);
}

export function configureAuthService(options = {}) {
  configureApiClientAuth(options);
}

export async function register(data) {
  try {
    const response = await apiClient.post("/auth/register", data);
    return normalizeAuthResult(response.data);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function login(credentials) {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return normalizeAuthResult(response.data);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function refreshSession() {
  try {
    const response = await apiClient.post("/auth/refresh");
    return normalizeAuthResult(response.data);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/auth/me");
    const payload = response.data;
    return payload?.user ?? payload?.data ?? payload;
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function updateProfile(data) {
  try {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const response = await apiClient.patch("/auth/me", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });

    return normalizeAuthResult(response.data);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function changePassword(data) {
  try {
    const response = await apiClient.patch("/auth/me/password", data);
    return response.data;
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // Clearing local auth state is handled by the auth context.
  }
}

export const signup = register;

export default {
  register,
  signup,
  login,
  refreshSession,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  configureAuthService,
};
