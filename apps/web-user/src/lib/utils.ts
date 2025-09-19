
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Import AuthService để lấy token


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Configuration

const getBaseUrl = () => {
  console.log('🔍 Environment:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
  
  // Check if we have custom API URL first
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('✅ Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running on Vercel (true production), use Railway
  if (process.env.VERCEL_ENV) {
    console.log('✅ Using Vercel/Railway URL');
    return 'https://viland-travel-production.up.railway.app';
  }
  
  // Otherwise (development or Docker), use local server
  console.log('✅ Using localhost:5000');
  return 'http://localhost:5000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  VERSION: "v1",
  get FULL_URL() {
    // If using proxy, don't append /api/v1 since proxy handles it
    if (this.BASE_URL.includes('/api/proxy')) {
      return this.BASE_URL;
    }
    return `${this.BASE_URL}/api/${this.VERSION}`;
  },
};

// API Helper functions
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('vilandtravel_access_token');
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
  }
  return {};
};

export const apiClient = {
  async get(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit
  ) {
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
          ...getAuthHeader(),
          ...options?.headers,
        },
        credentials: "include", // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API GET request failed:", error);
      throw error;
    }
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include", // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API POST request failed:", error);
      throw error;
    }
  },

  async put(endpoint: string, data?: any, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include", // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API PUT request failed:", error);
      throw error;
    }
  },

  async delete(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
          ...options?.headers,
        },
        credentials: "include", // Always include cookies for session-based auth
        ...options,
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API DELETE request failed:", error);
      throw error;
    }
  },
};
