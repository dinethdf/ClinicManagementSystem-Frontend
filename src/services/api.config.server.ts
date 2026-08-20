// lib/api.config.server.ts

import { cookies } from 'next/headers';

interface ApiErrorResponse {
  status: string;
  defaultMessage: string;
  data: null;
  errorCode?: string; 
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details: any;

  constructor(message: string, status: number, details: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function apiFetch(endpoint: string, options: RequestInit = {}, isFullResponse: boolean = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('accessToken')?.value;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        cache: 'no-store',
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = 'An unknown API error occurred';
      let errorCode = null;
      
      try {
        const errorBody = await res.json();

        errorMessage = errorBody.defaultMessage || errorBody.message || errorBody.error || res.statusText || errorMessage;
        errorCode = errorBody.errorCode || errorBody.code || errorBody;
      } catch {
        errorMessage = res.statusText || errorMessage;
      }
      
      console.error(`API Error (${res.status}): ${errorMessage}`);

      throw new ApiError(
        errorMessage,
        res.status,
        errorCode
      );
    }

    if (res.status === 204) {
      return null;
    }

    const json = await res.json();

    
return json.data == undefined || isFullResponse ? json : json.data; 

  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please check your internet connection and try again.', 408);
    }

    // Handle network-level errors (server down, no internet)
    if (error instanceof TypeError && (error.message.includes('fetch failed') || error.message.includes('Failed to fetch'))) {
      throw new ApiError('Unable to connect to the server. Please check your internet connection or try again later.', 503);
    }

    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Catch-all for other errors
    throw new ApiError(error.message || 'An unexpected error occurred', 500);
  }
}

export const http = {
  get: <T = any>(endpoint: string, isFullResponse: boolean = false): Promise<T> =>
    apiFetch(endpoint, { method: 'GET' }, isFullResponse),

  post: <T = any>(endpoint: string, body: any, isFullResponse: boolean = false): Promise<T> =>
    apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }, isFullResponse),

  put: <T = any>(endpoint: string, body: any, isFullResponse: boolean = false): Promise<T> =>
    apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }, isFullResponse),

  patch: <T = any>(endpoint: string, isFullResponse: boolean = false  ): Promise<T> =>
    apiFetch(endpoint, { method: 'PATCH' }, isFullResponse),  

  delete: <T = any>(endpoint: string): Promise<T> =>
    apiFetch(endpoint, { method: 'DELETE' }),
};