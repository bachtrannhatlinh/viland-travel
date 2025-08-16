import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://server666.vercel.app",
  VERSION: "v1",
  get FULL_URL() {
    return `${this.BASE_URL}/api/${this.VERSION}`;
  },
};

// API Helper functions
export const apiClient = {
  async get(endpoint: string, params?: Record<string, any>, options?: RequestInit) {
    const url = new URL(`${API_CONFIG.FULL_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        credentials: 'include', // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },

  async put(endpoint: string, data?: any, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API PUT request failed:', error);
      throw error;
    }
  },

  async delete(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        credentials: 'include', // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API DELETE request failed:', error);
      throw error;
    }
  },
};
