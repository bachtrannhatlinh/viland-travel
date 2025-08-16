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
  async get(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_CONFIG.FULL_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString());
    const responseData = await response.json();

    // Always return the response data, let the caller handle success/error
    return responseData;
  },

  async post(endpoint: string, data?: any) {
    const response = await fetch(`${API_CONFIG.FULL_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();

    // Always return the response data, let the caller handle success/error
    return responseData;
  },
};
