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
  first_name: string;
  lastName: string;
  last_name: string;
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
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { user: null, isAuthenticated: false }
      }));
    }
  }

  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
    return hasAccessToken || hasAuthFlag || hasUserData;
  }

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
      if (data.success || data.user) {
        if (data.success && data.data) {
          const userData = data.data.user || data.data;
          const token = data.data.token || data.token;

          if (token) {
            const tokens = {
              accessToken: token,
              refreshToken: token,
            };
            this.setTokens(tokens);
          }

          if (userData) {
            this.setUser(userData);
          }
        }
        else if (data.user) {
          this.setUser(data.user);
          localStorage.setItem("vilandtravel_authenticated", "true");

          if (data.token || data.accessToken) {
            const tokens = {
              accessToken: data.token || data.accessToken,
              refreshToken: data.refreshToken || data.token || data.accessToken
            };
            this.setTokens(tokens);
          } else {
            const tokenObtained = await this.tryGetToken();

            if (!tokenObtained) {
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

  createSessionToken(user: User): void {
    const sessionToken = `session_${user.id || user._id}_${Date.now()}`;
    const tokens = {
      accessToken: sessionToken,
      refreshToken: sessionToken
    };
    this.setTokens(tokens);
  }

  async tryGetToken(): Promise<boolean> {
    try {
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
      const token = this.getAccessToken();
      if (token) {
        await apiClient.post("/auth/logout", {});
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      this.clearTokens();
    }
  }

  

  async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getAccessToken();
    const fullUrl = `${API_CONFIG.FULL_URL}${endpoint}`;
    const isSessionToken = token && token.startsWith('session_');

    const config: RequestInit = {
      method: "GET",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && !isSessionToken && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(fullUrl, config);

      if (response.status === 401) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

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

  async getProfile(): Promise<User | null> {
    try {
      const data = await apiClient.get("/auth/profile");

      if (data.success && data.data?.user) {
        this.setUser(data.data.user);
        return data.data.user;
      } else if (data.user) {
        this.setUser(data.user);
        return data.user;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<boolean> {
    try {
      const token = this.getAccessToken();

      let data;

      if (token) {
        data = await this.authenticatedPut("/auth/profile", profileData);
      } else {
        data = await apiClient.put("/auth/profile", profileData);
      }

      if (data.success && data.data?.user) {
        this.setUser(data.data.user);
        return true;
      } else if (data.user) {
        this.setUser(data.user);
        return true;
      } else if (data.message === "Profile updated successfully" || data.status === "success") {
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
