import { apiClient, API_CONFIG } from "./utils";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id?: number;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  status?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  loyaltyPoints?: number;
  lastLogin?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = "vilandtravel_access_token";
  private readonly REFRESH_TOKEN_KEY = "vilandtravel_refresh_token";
  private readonly USER_KEY = "vilandtravel_user";

  // Token management
  setTokens(tokens: AuthTokens): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem("vilandtravel_authenticated");
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { user: null, isAuthenticated: false }
      }));
    }
  }

  // User management
  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { user, isAuthenticated: true }
      }));
    }
  }

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const hasAccessToken = !!this.getAccessToken();
    const hasAuthFlag =
      typeof window !== "undefined" &&
      localStorage.getItem("vilandtravel_authenticated") === "true";
    const hasUserData = !!this.getUser();
    // Check for access token, authentication flag, or user data
    return hasAccessToken || hasAuthFlag || hasUserData;
  }

  // Authentication API calls
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      const data = await apiClient.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const data = await apiClient.post("/auth/login", {
        email,
        password,
      });
      // Handle different response structures
      if (data.success || data.user) {
        // Case 1: Response with success flag and nested data
        if (data.success && data.data) {
          const userData = data.data.user || data.data;
          const token = data.data.token || data.token;

          if (token) {
            const tokens = {
              accessToken: token,
              refreshToken: token, // Use same token for refresh for now
            };
            this.setTokens(tokens);
          }

          if (userData) {
            this.setUser(userData);
          }
        }
        // Case 2: Direct user object response (current server response)
        else if (data.user) {
          this.setUser(data.user);
          // For now, we'll mark as authenticated without tokens
          // You may need to implement token-less authentication or update server
          localStorage.setItem("vilandtravel_authenticated", "true");

          // Check if there are any tokens in the response
          if (data.token || data.accessToken) {
            const tokens = {
              accessToken: data.token || data.accessToken,
              refreshToken: data.refreshToken || data.token || data.accessToken
            };
            this.setTokens(tokens);
          } else {
            // Try to get token from a separate endpoint
            const tokenObtained = await this.tryGetToken();

            if (!tokenObtained) {
              // Create a session-based token for API calls
              this.createSessionToken(data.user);
            }
          }
        }

        return { success: true, data: data };
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  // Create a session-based token for API calls when server doesn't provide JWT
  createSessionToken(user: User): void {
    // Create a simple session identifier
    const sessionToken = `session_${user.id || user._id}_${Date.now()}`;
    const tokens = {
      accessToken: sessionToken,
      refreshToken: sessionToken
    };
    this.setTokens(tokens);
  }

  // Try to get token from server (for servers that don't return token in login response)
  async tryGetToken(): Promise<boolean> {
    try {
      // Try common token endpoints
      const endpoints = ['/auth/token', '/auth/me', '/user/token'];

      for (const endpoint of endpoints) {
        try {
          const response = await apiClient.get(endpoint);

          if (response.token || response.accessToken) {
            const tokens = {
              accessToken: response.token || response.accessToken,
              refreshToken: response.refreshToken || response.token || response.accessToken
            };
            this.setTokens(tokens);
            return true;
          }
        } catch (error) {
          console.log(`Failed to get token from ${endpoint}:`, error);
          // Continue to next endpoint
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const data = await apiClient.post("/auth/refresh-token", {
        refreshToken,
      });

      if (data.success) {
        this.setTokens(data.data);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return false;
  }

  async logout(): Promise<void> {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      const token = this.getAccessToken();
      if (token) {
        await apiClient.post("/auth/logout", {});
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    } finally {
      this.clearTokens();
    }
  }

  

  // API calls with auto token attachment using API_CONFIG
  async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getAccessToken();
    const fullUrl = `${API_CONFIG.FULL_URL}${endpoint}`;
    const isSessionToken = token && token.startsWith('session_');

    const config: RequestInit = {
      method: "GET", // Default method
      ...options,
      headers: {
        "Content-Type": "application/json",
        // Only send Authorization header for real JWT tokens, not session tokens
        ...(token && !isSessionToken && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // Always include credentials for session-based auth
      credentials: 'include',
    };

    try {
      const response = await fetch(fullUrl, config);

      // Handle different response status codes
      if (response.status === 401) {
        // For debugging: don't auto-logout, just throw error
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);

        // TODO: Re-enable auto-logout after debugging
        // console.log("Token expired, attempting refresh...");
        // const refreshed = await this.refreshToken();
        // if (refreshed) {
        //   // Retry with new token
        //   const newConfig = {
        //     ...config,
        //     headers: {
        //       ...config.headers,
        //       Authorization: `Bearer ${this.getAccessToken()}`,
        //     },
        //   };
        //   console.log("Retrying request with new token...");
        //   const retryResponse = await fetch(fullUrl, newConfig);
        //   return await this.handleResponse(retryResponse);
        // } else {
        //   // Refresh failed, logout
        //   console.log("Token refresh failed, logging out...");
        //   await this.logout();
        //   if (typeof window !== "undefined") {
        //     window.location.href = "/login";
        //   }
        //   throw new Error("Authentication failed - please login again");
        // }
      }

      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Helper method to handle response parsing
  private async handleResponse(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
      } else {
        // Handle non-JSON responses
        const text = await response.text();

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return text;
      }
    } catch (error) {
      throw error;
    }
  }

  // Convenience methods for common HTTP operations
  async authenticatedGet(endpoint: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(`${API_CONFIG.FULL_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return this.authenticatedRequest(endpoint + (url.search || ''), {
      method: "GET"
    });
  }

  async authenticatedPost(endpoint: string, data?: any): Promise<any> {
    return this.authenticatedRequest(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async authenticatedPut(endpoint: string, data?: any): Promise<any> {
    return this.authenticatedRequest(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async authenticatedDelete(endpoint: string): Promise<any> {
    return this.authenticatedRequest(endpoint, {
      method: "DELETE",
    });
  }

  // Get user profile from server
  async getProfile(): Promise<User | null> {
    try {
      // Since current server doesn't use JWT tokens, use regular apiClient
      const data = await apiClient.get("/auth/profile");

      if (data.success && data.data?.user) {
        this.setUser(data.data.user);
        return data.data.user;
      } else if (data.user) {
        // Handle direct user response
        this.setUser(data.user);
        return data.user;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<boolean> {
    try {
      const token = this.getAccessToken();

      let data;

      if (token) {
        // Use authenticated request with JWT token
        data = await this.authenticatedPut("/auth/profile", profileData);
      } else {
        data = await apiClient.put("/auth/profile", profileData);
      }

      if (data.success && data.data?.user) {
        this.setUser(data.data.user);
        return true;
      } else if (data.user) {
        // Handle direct user response
        this.setUser(data.user);
        return true;
      } else if (data.message === "Profile updated successfully" || data.status === "success") {
        // Handle success response without user data - refresh from server
        const updatedProfile = await this.getProfile();
        return !!updatedProfile;
      }

      return false;
    } catch (error) {
      console.error("Update profile failed:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
