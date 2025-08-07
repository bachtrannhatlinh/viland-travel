import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum CarStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive'
}

export enum CarType {
  ECONOMY = 'economy',
  COMPACT = 'compact',
  MIDSIZE = 'midsize',
  STANDARD = 'standard',
  FULLSIZE = 'fullsize',
  PREMIUM = 'premium',
  LUXURY = 'luxury',
  SUV = 'suv',
  MINIVAN = 'minivan',
  CONVERTIBLE = 'convertible'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic'
}

@Entity('car_rentals')
@Index(['make'])
@Index(['model'])
@Index(['type'])
@Index(['status'])
@Index(['location'])
@Index(['pricePerDay'])
export class CarRental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  make: string; // Toyota, Honda, etc.

  @Column({ type: 'varchar', length: 100 })
  model: string; // Camry, Civic, etc.

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'enum',
    enum: CarType
  })
  type: CarType;

  @Column({
    type: 'enum',
    enum: CarStatus,
    default: CarStatus.AVAILABLE
  })
  status: CarStatus;

  @Column({ type: 'varchar', length: 20 })
  licensePlate: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({
    type: 'enum',
    enum: FuelType
  })
  fuelType: FuelType;

  @Column({
    type: 'enum',
    enum: TransmissionType
  })
  transmission: TransmissionType;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'int' })
  doors: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  engineSize: number; // Liter

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerDay: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ type: 'jsonb' })
  images: string[];

  @Column({ type: 'jsonb' })
  features: string[]; // Air conditioning, GPS, Bluetooth, etc.

  @Column({ type: 'jsonb' })
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    pickupPoints?: {
      name: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    }[];
  };

  @Column({ type: 'int', default: 0 })
  mileage: number; // Kilometers

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'jsonb', nullable: true })
  insurance: {
    basic: {
      included: boolean;
      coverage: string;
    };
    comprehensive: {
      available: boolean;
      pricePerDay?: number;
      coverage: string;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  rentalTerms: {
    minAge: number;
    maxAge?: number;
    licenseRequired: string[];
    additionalFees: {
      youngDriver?: number;
      additionalDriver?: number;
      gps?: number;
      childSeat?: number;
    };
    fuelPolicy: string;
    mileageLimit?: number;
    lateFee?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    calendar: {
      date: string;
      available: boolean;
      price?: number;
    }[];
    minRentalDays: number;
    maxRentalDays?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  maintenance: {
    lastService: string;
    nextService: string;
    history: {
      date: string;
      type: string;
      description: string;
      cost?: number;
    }[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isAvailable(): boolean {
    return this.status === CarStatus.AVAILABLE;
  }

  get fullName(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }

  get averageRating(): number {
    return this.reviewCount > 0 ? this.rating : 0;
  }

  get dailyRate(): number {
    return this.pricePerDay;
  }
}
