// src/lib/env.ts
/**
 * Environment variable validation and configuration
 * This ensures all required environment variables are present at runtime
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // Authentication
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '24h'), // Reduced from 7d to 24h for security
  
  // App
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // Admin
  ADMIN_SESSION_DURATION: getEnvVar('ADMIN_SESSION_DURATION', '8h'), // 8 hours for admin sessions
} as const;

// Validate all environment variables on module load
export function validateEnv() {
  try {
    Object.entries(env).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
      }
    });
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}

export default env;
