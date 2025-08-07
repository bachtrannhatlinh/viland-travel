import Redis from 'ioredis';

// Redis client cho caching chung
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// Redis client riêng cho session
export const sessionRedisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_SESSION_DB || '1'), // DB khác cho session
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// Cache service class
export class CacheService {
  private client: Redis;
  
  constructor(client: Redis = redisClient) {
    this.client = client;
  }

  // Basic cache operations
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  // JSON cache operations
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET JSON error:', error);
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(value);
      return await this.set(key, jsonString, ttl);
    } catch (error) {
      console.error('Redis SET JSON error:', error);
      return false;
    }
  }

  // Search result caching
  async cacheSearchResults(searchKey: string, results: any[], ttl: number = 300): Promise<boolean> {
    const key = `search:${searchKey}`;
    return await this.setJson(key, results, ttl);
  }

  async getSearchResults<T>(searchKey: string): Promise<T[] | null> {
    const key = `search:${searchKey}`;
    return await this.getJson<T[]>(key);
  }

  // User session caching
  async cacheUserSession(userId: string, sessionData: any, ttl: number = 86400): Promise<boolean> {
    const key = `session:user:${userId}`;
    return await this.setJson(key, sessionData, ttl);
  }

  async getUserSession<T>(userId: string): Promise<T | null> {
    const key = `session:user:${userId}`;
    return await this.getJson<T>(key);
  }

  async clearUserSession(userId: string): Promise<boolean> {
    const key = `session:user:${userId}`;
    return await this.del(key);
  }

  // Flight search caching
  async cacheFlightResults(searchParams: string, results: any[], ttl: number = 600): Promise<boolean> {
    const key = `flights:${searchParams}`;
    return await this.setJson(key, results, ttl);
  }

  async getFlightResults(searchParams: string): Promise<any[] | null> {
    const key = `flights:${searchParams}`;
    return await this.getJson<any[]>(key);
  }

  // Hotel search caching
  async cacheHotelResults(searchParams: string, results: any[], ttl: number = 1800): Promise<boolean> {
    const key = `hotels:${searchParams}`;
    return await this.setJson(key, results, ttl);
  }

  async getHotelResults(searchParams: string): Promise<any[] | null> {
    const key = `hotels:${searchParams}`;
    return await this.getJson<any[]>(key);
  }

  // Tour search caching
  async cacheTourResults(searchParams: string, results: any[], ttl: number = 3600): Promise<boolean> {
    const key = `tours:${searchParams}`;
    return await this.setJson(key, results, ttl);
  }

  async getTourResults(searchParams: string): Promise<any[] | null> {
    const key = `tours:${searchParams}`;
    return await this.getJson<any[]>(key);
  }

  // Popular searches caching
  async cachePopularSearches(type: string, searches: any[], ttl: number = 7200): Promise<boolean> {
    const key = `popular:${type}`;
    return await this.setJson(key, searches, ttl);
  }

  async getPopularSearches(type: string): Promise<any[] | null> {
    const key = `popular:${type}`;
    return await this.getJson<any[]>(key);
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number }> {
    const key = `rate_limit:${identifier}`;
    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, window);
      }
      
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current)
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true, remaining: limit };
    }
  }

  // Connection management
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Redis connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      console.log('Redis disconnected successfully');
    } catch (error) {
      console.error('Redis disconnection error:', error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis ping error:', error);
      return false;
    }
  }
}

// Default cache service instance
export const cacheService = new CacheService(redisClient);

// Session-specific cache service
export const sessionCacheService = new CacheService(sessionRedisClient);

// Connection handlers
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

sessionRedisClient.on('connect', () => {
  console.log('Redis session client connected');
});

sessionRedisClient.on('error', (error) => {
  console.error('Redis session client error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redisClient.disconnect();
  await sessionRedisClient.disconnect();
});

export { Redis };
