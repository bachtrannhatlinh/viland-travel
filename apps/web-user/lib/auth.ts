interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthService {
  async register(firstName: string, lastName: string, email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await response.json();
    return data;
  }
  private readonly ACCESS_TOKEN_KEY = 'vilandtravel_access_token';
  private readonly REFRESH_TOKEN_KEY = 'vilandtravel_refresh_token';
  private readonly USER_KEY = 'vilandtravel_user';

  // Token management
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // API calls with auto token attachment
  async apiCall(endpoint: string, options: RequestInit = {}) {
    const token = this.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired, try refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry with new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.getAccessToken()}`,
        };
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
      } else {
        // Refresh failed, logout
        this.logout();
        window.location.href = '/login';
      }
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      this.setTokens({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
      this.setUser(data.data.user);
    }

    return data;
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.success) {
        this.setTokens(data.data);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  logout(): void {
    this.clearTokens();
  }
}

export const authService = new AuthService();