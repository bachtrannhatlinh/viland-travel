import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gosafe';
    
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📊 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('📴 Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
    throw error;
  }
};

import { AppDataSource } from './postgresql';
import { redisClient, sessionRedisClient, cacheService, sessionCacheService } from './redis';
import elasticsearchService from './elasticsearch';

export class DatabaseService {
  private isInitialized = false;

  // Initialize all database connections
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database service already initialized');
      return;
    }

    try {
      console.log('Initializing database connections...');

      // Initialize PostgreSQL
      await this.initializePostgreSQL();

      // Initialize Redis
      await this.initializeRedis();

      // Initialize Elasticsearch
      await this.initializeElasticsearch();

      this.isInitialized = true;
      console.log('All database connections initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // PostgreSQL initialization
  private async initializePostgreSQL(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('PostgreSQL connected successfully');
        
        // Run migrations if needed
        if (process.env.NODE_ENV === 'development') {
          await AppDataSource.synchronize();
          console.log('Database schema synchronized');
        }
      }
    } catch (error) {
      console.error('PostgreSQL initialization error:', error);
      throw new Error(`PostgreSQL connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Redis initialization
  private async initializeRedis(): Promise<void> {
    try {
      // Connect main Redis client
      if (redisClient.status !== 'ready') {
        await redisClient.connect();
      }

      // Connect session Redis client
      if (sessionRedisClient.status !== 'ready') {
        await sessionRedisClient.connect();
      }

      // Test connections
      const mainPing = await cacheService.ping();
      const sessionPing = await sessionCacheService.ping();

      if (!mainPing || !sessionPing) {
        throw new Error('Redis ping test failed');
      }

      console.log('Redis clients connected successfully');
    } catch (error) {
      console.error('Redis initialization error:', error);
      throw new Error(`Redis connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Elasticsearch initialization
  private async initializeElasticsearch(): Promise<void> {
    try {
      // Test connection
      const isHealthy = await elasticsearchService.ping();
      if (!isHealthy) {
        console.log('⚠️  Elasticsearch not available - service disabled');
        return;
      }

      // Initialize elasticsearch
      await elasticsearchService.connect();

      console.log('✅ Elasticsearch connected and initialized successfully');
    } catch (error) {
      console.error('⚠️  Elasticsearch initialization skipped:', error);
      // Don't throw error - elasticsearch is optional for development
    }
  }

  // Health checks
  async healthCheck(): Promise<{
    postgresql: boolean;
    redis: boolean;
    elasticsearch: boolean;
    overall: boolean;
  }> {
    const health = {
      postgresql: false,
      redis: false,
      elasticsearch: false,
      overall: false
    };

    try {
      // PostgreSQL health check
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1');
        health.postgresql = true;
      }
    } catch (error) {
      console.error('PostgreSQL health check failed:', error);
    }

    try {
      // Redis health check
      const mainPing = await cacheService.ping();
      const sessionPing = await sessionCacheService.ping();
      health.redis = mainPing && sessionPing;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    try {
      // Elasticsearch health check
      health.elasticsearch = await elasticsearchService.ping();
    } catch (error) {
      console.error('Elasticsearch health check failed:', error);
    }

    health.overall = health.postgresql && health.redis && health.elasticsearch;
    return health;
  }

  // Get connection info
  getConnectionInfo(): {
    postgresql: any;
    redis: any;
    elasticsearch: any;
  } {
    return {
      postgresql: {
        isInitialized: AppDataSource.isInitialized,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        database: process.env.DB_NAME || 'gosafe_booking'
      },
      redis: {
        main: {
          status: redisClient.status,
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || '6379',
          db: process.env.REDIS_DB || '0'
        },
        session: {
          status: sessionRedisClient.status,
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || '6379',
          db: process.env.REDIS_SESSION_DB || '1'
        }
      },
      elasticsearch: {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
      }
    };
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('Shutting down database connections...');

    try {
      // Close PostgreSQL connection
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('PostgreSQL connection closed');
      }

      // Close Redis connections
      await redisClient.disconnect();
      await sessionRedisClient.disconnect();
      console.log('Redis connections closed');

      // Elasticsearch client doesn't need explicit closing
      console.log('Database shutdown completed');
    } catch (error) {
      console.error('Database shutdown error:', error);
      throw error;
    }
  }

  // Getters for direct access
  get postgresql() {
    return AppDataSource;
  }

  get redis() {
    return {
      main: redisClient,
      session: sessionRedisClient,
      cache: cacheService,
      sessionCache: sessionCacheService
    };
  }

  get elasticsearch() {
    return {
      client: elasticsearchService,
      search: elasticsearchService
    };
  }

  get isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
export const databaseService = new DatabaseService();

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received, shutting down gracefully...');
  await databaseService.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received, shutting down gracefully...');
  await databaseService.shutdown();
  process.exit(0);
});

// Export individual services for convenience
export {
  AppDataSource,
  redisClient,
  sessionRedisClient,
  cacheService,
  sessionCacheService,
  elasticsearchService
};
