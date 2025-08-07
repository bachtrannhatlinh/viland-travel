import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_TRIP = 'on_trip',
  SUSPENDED = 'suspended'
}

export enum DriverServiceType {
  AIRPORT_TRANSFER = 'airport_transfer',
  CITY_TOUR = 'city_tour',
  INTERCITY = 'intercity',
  HOURLY = 'hourly',
  DAILY = 'daily'
}

export enum VehicleType {
  CAR_4_SEATS = 'car_4_seats',
  CAR_7_SEATS = 'car_7_seats',
  VAN_16_SEATS = 'van_16_seats',
  BUS_29_SEATS = 'bus_29_seats',
  BUS_45_SEATS = 'bus_45_seats',
  LUXURY_CAR = 'luxury_car',
  MOTORBIKE = 'motorbike'
}

@Entity('drivers')
@Index(['status'])
@Index(['serviceType'])
@Index(['vehicleType'])
@Index(['location'])
@Index(['rating'])
@Index(['isVerified'])
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.INACTIVE
  })
  status: DriverStatus;

  @Column({ type: 'jsonb' })
  serviceType: DriverServiceType[];

  @Column({
    type: 'enum',
    enum: VehicleType
  })
  vehicleType: VehicleType;

  @Column({ type: 'varchar', length: 255 })
  vehicleMake: string;

  @Column({ type: 'varchar', length: 255 })
  vehicleModel: string;

  @Column({ type: 'int' })
  vehicleYear: number;

  @Column({ type: 'varchar', length: 20 })
  vehicleLicensePlate: string;

  @Column({ type: 'varchar', length: 50 })
  vehicleColor: string;

  @Column({ type: 'jsonb' })
  vehicleImages: string[];

  @Column({ type: 'jsonb' })
  documents: {
    drivingLicense: {
      number: string;
      expiryDate: string;
      images: string[];
      verified: boolean;
    };
    vehicleRegistration: {
      number: string;
      expiryDate: string;
      images: string[];
      verified: boolean;
    };
    insurance: {
      policyNumber: string;
      expiryDate: string;
      images: string[];
      verified: boolean;
    };
    identity: {
      type: string; // CCCD, CMND, Passport
      number: string;
      images: string[];
      verified: boolean;
    };
  };

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  totalTrips: number;

  @Column({ type: 'jsonb' })
  location: {
    currentCity: string;
    operatingAreas: string[]; // Cities/areas they serve
    currentPosition?: {
      lat: number;
      lng: number;
      lastUpdated: string;
    };
  };

  @Column({ type: 'jsonb' })
  pricing: {
    [DriverServiceType.AIRPORT_TRANSFER]?: {
      basePrice: number;
      perKmPrice?: number;
    };
    [DriverServiceType.CITY_TOUR]?: {
      halfDayPrice: number;
      fullDayPrice: number;
    };
    [DriverServiceType.INTERCITY]?: {
      perKmPrice: number;
      minimumPrice: number;
    };
    [DriverServiceType.HOURLY]?: {
      perHourPrice: number;
      minimumHours: number;
    };
    [DriverServiceType.DAILY]?: {
      perDayPrice: number;
      overnightFee?: number;
    };
  };

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  languages: string[]; // Vietnamese, English, etc.

  @Column({ type: 'jsonb', nullable: true })
  specialties: string[]; // Airport pickup, Tourist guide, etc.

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    schedule: {
      monday: { available: boolean; from?: string; to?: string };
      tuesday: { available: boolean; from?: string; to?: string };
      wednesday: { available: boolean; from?: string; to?: string };
      thursday: { available: boolean; from?: string; to?: string };
      friday: { available: boolean; from?: string; to?: string };
      saturday: { available: boolean; from?: string; to?: string };
      sunday: { available: boolean; from?: string; to?: string };
    };
    blackoutDates: string[]; // Unavailable dates
  };

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImage: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  bankAccount: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    verified: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === DriverStatus.ACTIVE && this.isVerified;
  }

  get averageRating(): number {
    return this.reviewCount > 0 ? this.rating : 0;
  }

  get vehicleInfo(): string {
    return `${this.vehicleYear} ${this.vehicleMake} ${this.vehicleModel}`;
  }

  get isDocumentsComplete(): boolean {
    const docs = this.documents;
    return docs.drivingLicense.verified && 
           docs.vehicleRegistration.verified && 
           docs.insurance.verified && 
           docs.identity.verified;
  }
}
