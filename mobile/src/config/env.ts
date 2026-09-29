// Environment configuration
// Update these values based on your environment

const ENV = {
  // Development
  DEV: {
    API_URL: 'http://localhost:5000/api/v1',
    WS_URL: 'ws://localhost:5000',
  },
  // Production (update with your actual backend URL)
  PROD: {
    API_URL: 'https://api.latike.com/api/v1',
    WS_URL: 'wss://api.latike.com',
  },
};

// Determine current environment
const isDevelopment = __DEV__;

export const config = {
  API_URL: isDevelopment ? ENV.DEV.API_URL : ENV.PROD.API_URL,
  WS_URL: isDevelopment ? ENV.DEV.WS_URL : ENV.PROD.WS_URL,
  IS_DEV: isDevelopment,
};

export default config;
