// src/lib/apiClient.ts
/**
 * Centralized API client with proper error handling and type safety
 */

import { ApiResponse } from '@/types/api';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants';

interface RequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean>;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base API client class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Generic request method
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { data, params, headers, ...restOptions } = options;

    const url = this.buildURL(endpoint, params);

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // Include cookies for authentication
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      let result: ApiResponse<T>;
      
      try {
        result = await response.json();
      } catch {
        // Handle non-JSON responses
        result = {
          success: response.ok,
          error: response.ok ? undefined : ERROR_MESSAGES.SERVER_ERROR,
        };
      }

      if (!response.ok) {
        throw new ApiError(
          result.error || result.message || ERROR_MESSAGES.SERVER_ERROR,
          response.status,
          result
        );
      }

      return result;
      
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network errors
      if (error instanceof TypeError) {
        throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
      }
      
      // Unknown errors
      throw new ApiError(ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: Omit<RequestOptions, 'method' | 'data' | 'params'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      params,
    });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      data,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: Omit<RequestOptions, 'method' | 'params'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      params,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      data,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient, ApiError };

// Export helper functions
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
}
