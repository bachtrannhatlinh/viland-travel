import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Tour } from '../entities/Tour.entity';
import { Booking } from '../entities/Booking.entity';
import { Payment } from '../entities/Payment.entity';
import { Flight } from '../entities/Flight.entity';
import { Hotel } from '../entities/Hotel.entity';
import { CarRental } from '../entities/CarRental.entity';
import { Driver } from '../entities/Driver.entity';
import { News } from '../entities/News.entity';
import { Contact } from '../entities/Contact.entity';
import { Review } from '../entities/Review.entity';
import { Partner } from '../entities/Partner.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '7000'),
  username: process.env.DB_USERNAME || 'linhbtn',
  password: process.env.DB_PASSWORD || 'linhprono1',
  database: process.env.DB_NAME || 'ViLandTravel',
  synchronize: false, // Disable auto-sync to use migrations
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false, // Don't auto-run migrations
  entities: [
    User,
    Tour,
    Booking,
    Payment,
    Flight,
    Hotel,
    CarRental,
    Driver,
    News,
    Contact,
    Review,
    Partner
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    connectionLimit: 20,
    acquireTimeoutMillis: 60000,
    timeout: 60000,
  }
});

export const connectPostgreSQL = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
};

export const disconnectPostgreSQL = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    console.log('📴 PostgreSQL disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from PostgreSQL:', error);
    throw error;
  }
};
