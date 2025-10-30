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

async function apiFetch(endpoint: string, options: RequestInit = {}) {
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
    }
  );

  if (!res.ok) {
    let errorBody: ApiErrorResponse;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = {
        status: 'ERROR',
        defaultMessage: res.statusText || 'An unknown API error occurred',
        data: null,
      };
    }
    
    console.error(`API Error (${res.status}): ${errorBody.defaultMessage}`, errorBody);

    throw new ApiError(
      errorBody.defaultMessage,
      res.status,
      errorBody.errorCode || errorBody
    );
  }

  if (res.status === 204) {
    return null;
  }

  const json = await res.json();
  return json.data;
}

export const http = {
  get: <T = any>(endpoint: string): Promise<T> =>
    apiFetch(endpoint, { method: 'GET' }),

  post: <T = any>(endpoint: string, body: any): Promise<T> =>
    apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T = any>(endpoint: string, body: any): Promise<T> =>
    apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T = any>(endpoint: string): Promise<T> =>
    apiFetch(endpoint, { method: 'DELETE' }),
};