// src/hooks/useApi.ts
/**
 * Custom hook for API calls with loading, error, and data states
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient, isApiError, getErrorMessage } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  immediate?: boolean; // Execute immediately on mount
}

export interface UseApiReturn<T, P extends any[] = []> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
  refetch: () => Promise<T | null>;
}

/**
 * Hook for handling API calls with automatic loading and error states
 */
export function useApi<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const { initialData = null, onSuccess, onError, immediate = false } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store params for refetch functionality
  const lastParamsRef = useRef<P | null>(null);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setLoading(true);
      setError(null);
      lastParamsRef.current = params;

      try {
        const response = await apiFunction(...params);

        if (response.success && response.data) {
          setData(response.data);
          onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMessage = response.error || 'An error occurred';
          setError(errorMessage);
          onError?.(errorMessage);
          return null;
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  /**
   * Refetch with last used parameters
   */
  const refetch = useCallback(async (): Promise<T | null> => {
    if (lastParamsRef.current) {
      return execute(...lastParamsRef.current);
    }
    return null;
  }, [execute]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    lastParamsRef.current = null;
  }, [initialData]);

  // Execute immediately on mount if specified
  useEffect(() => {
    if (immediate && lastParamsRef.current === null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (execute as any)();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    refetch,
  };
}

/**
 * Hook for GET requests with automatic execution
 */
export function useApiGet<T>(
  endpoint: string,
  params?: Record<string, any>,
  options: Omit<UseApiOptions<T>, 'immediate'> = {}
): UseApiReturn<T, []> {
  return useApi<T, []>(
    () => apiClient.get<T>(endpoint, params),
    { ...options, immediate: true }
  );
}

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 */
export function useApiMutation<T, D extends Record<string, any> = Record<string, any>>(
  method: 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, [D?]> {
  return useApi<T, [D?]>(
    (data?: D) => {
      switch (method) {
        case 'post':
          return apiClient.post<T>(endpoint, data);
        case 'put':
          return apiClient.put<T>(endpoint, data);
        case 'delete':
          // delete uses params (query string), not body
          return apiClient.delete<T>(endpoint, data as Record<string, any> | undefined);
        case 'patch':
          return apiClient.patch<T>(endpoint, data);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    options
  );
}
