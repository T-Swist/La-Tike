import config from '../config/env';

// Turns an RTK Query error into a message that can be shown to the user.
export const getErrorMessage = (error: any, fallback = 'Something went wrong'): string => {
  if (!error) return fallback;
  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return `Cannot reach the server at ${config.API_URL}. Check your connection and that the API is running.`;
  }
  return error.data?.error || error.data?.message || error.error || fallback;
};
