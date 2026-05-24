/**
 * Error Handling Utilities
 *
 * Centralized error handling for the DevTribe frontend
 * Provides consistent error messages and error type detection
 *
 * Location: src/utils/errorHandler.js
 */

/**
 * Extract a user-friendly error message from any error type
 * Handles various response formats from the backend
 *
 * @param {Error|AxiosError|any} error - The error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  // Check nested response data (standard format)
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Check top-level message in response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check error.error structure
  if (error?.response?.data?.error) {
    return typeof error.response.data.error === "string"
      ? error.response.data.error
      : error.response.data.error.message;
  }

  // Check for validation errors
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.map((e) => e.message || String(e)).join(", ");
    }
    return String(errors);
  }

  // Fallback to error message
  if (error?.message) {
    return error.message;
  }

  // Last resort
  return "An unexpected error occurred. Please try again.";
}

/**
 * Determine error type for specific handling
 */
export function getErrorType(error) {
  const status = error?.response?.status;

  if (status === 400) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 409) return "conflict";
  if (status === 429) return "rateLimited";
  if (status >= 500) return "server";
  if (!status) return "network";

  return "unknown";
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error) {
  return error?.response?.status === 400;
}

/**
 * Check if error is unauthorized (401)
 */
export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

/**
 * Check if error is forbidden (403)
 */
export function isForbiddenError(error) {
  return error?.response?.status === 403;
}

/**
 * Check if error is not found (404)
 */
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}

/**
 * Check if error is conflict (409) - e.g., duplicate slug
 */
export function isConflictError(error) {
  return error?.response?.status === 409;
}

/**
 * Check if error is rate limited (429)
 */
export function isRateLimitedError(error) {
  return error?.response?.status === 429;
}

/**
 * Check if error is server error (5xx)
 */
export function isServerError(error) {
  const status = error?.response?.status;
  return status && status >= 500;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error) {
  return !error?.response && error?.message;
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessageByType(error) {
  const type = getErrorType(error);
  const message = getErrorMessage(error);

  const messages = {
    validation: `Invalid input: ${message}`,
    unauthorized: "You need to log in to perform this action.",
    forbidden: "You don't have permission to perform this action.",
    notFound: "The resource you're looking for doesn't exist.",
    conflict: `This resource already exists: ${message}`,
    rateLimited: "Too many requests. Please wait a moment and try again.",
    server: "Server error. Please try again later.",
    network: "Network error. Please check your connection.",
    unknown: message,
  };

  return messages[type] || message;
}

/**
 * Log error for debugging/monitoring
 */
export function logError(error, context = "") {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    type: getErrorType(error),
    message: getErrorMessage(error),
    status: error?.response?.status,
    url: error?.config?.url,
    method: error?.config?.method,
  };

  console.error("Error:", errorInfo);

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === "production") {
    // sendToErrorTracker(errorInfo);
  }

  return errorInfo;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(error) {
  if (!isValidationError(error)) return null;

  const errors = error?.response?.data?.errors || [];
  if (Array.isArray(errors)) {
    return errors.reduce((acc, err) => {
      const field = err.field || err.path || "general";
      acc[field] = err.message || err.msg || "Invalid value";
      return acc;
    }, {});
  }

  return null;
}

/**
 * Get all error details for debugging
 */
export function getErrorDetails(error) {
  return {
    message: getErrorMessage(error),
    type: getErrorType(error),
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    url: error?.config?.url,
    method: error?.config?.method,
    data: error?.response?.data,
    fullError: error,
  };
}

/**
 * Handle common error scenarios
 */
export function handleCommonErrors(error, onUnauthorized, onForbidden) {
  if (isUnauthorizedError(error)) {
    onUnauthorized?.();
  } else if (isForbiddenError(error)) {
    onForbidden?.();
  }
}

/**
 * Error boundary component helper
 */
export function createErrorBoundaryMessage(error) {
  return `Something went wrong: ${getErrorMessage(error)}`;
}

export default {
  getErrorMessage,
  getErrorType,
  isValidationError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isConflictError,
  isRateLimitedError,
  isServerError,
  isNetworkError,
  getErrorMessageByType,
  logError,
  formatValidationErrors,
  getErrorDetails,
  handleCommonErrors,
  createErrorBoundaryMessage,
};
