export const config = {
  proxyUrl: import.meta.env.VITE_PROXY_URL || 'http://localhost:3000',
  isDevelopment: import.meta.env.DEV,
  // Add other configuration values here
} as const;

// Ensure all environment variables are set
const requiredEnvVars = ['VITE_PROXY_URL'] as const;
if (import.meta.env.DEV) {
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      console.warn(`Missing environment variable: ${envVar}`);
    }
  }
} 