import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum FlightStatus {
  SCHEDULED = 'scheduled',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
  BOARDING = 'boarding',
  DEPARTED = 'departed',
  ARRIVED = 'arrived'
}

export enum FlightClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first'
}

export enum FlightType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international'
}

@Entity('flights')
@Index(['flightNumber'])
@Index(['departureAirport'])
@Index(['arrivalAirport'])
@Index(['departureDate'])
@Index(['status'])
@Index(['airline'])
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  flightNumber: string;

  @Column({ type: 'varchar', length: 100 })
  airline: string;

  @Column({ type: 'varchar', length: 10 })
  aircraftType: string;

  @Column({
    type: 'enum',
    enum: FlightType
  })
  type: FlightType;

  @Column({
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.SCHEDULED
  })
  status: FlightStatus;

  @Column({ type: 'varchar', length: 10 })
  departureAirport: string; // IATA code

  @Column({ type: 'varchar', length: 10 })
  arrivalAirport: string; // IATA code

  @Column({ type: 'varchar', length: 255 })
  departureCity: string;

  @Column({ type: 'varchar', length: 255 })
  arrivalCity: string;

  @Column({ type: 'timestamp' })
  departureDate: Date;

  @Column({ type: 'timestamp' })
  arrivalDate: Date;

  @Column({ type: 'int' })
  duration: number; // phút

  @Column({ type: 'jsonb' })
  pricing: {
    [FlightClass.ECONOMY]: {
      available: number;
      price: number;
      originalPrice?: number;
    };
    [FlightClass.PREMIUM_ECONOMY]?: {
      available: number;
      price: number;
      originalPrice?: number;
    };
    [FlightClass.BUSINESS]?: {
      available: number;
      price: number;
      originalPrice?: number;
    };
    [FlightClass.FIRST]?: {
      available: number;
      price: number;
      originalPrice?: number;
    };
  };

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  baggage: {
    cabin: {
      weight: number;
      dimensions: string;
    };
    checked: {
      weight: number;
      additionalFee?: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  amenities: {
    wifi: boolean;
    meals: boolean;
    entertainment: boolean;
    powerOutlets: boolean;
    extraLegroom?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  cancellationPolicy: {
    refundable: boolean;
    changeFee?: number;
    cancellationFee?: number;
    terms: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  stopover: {
    airports: string[];
    duration: number; // total stopover time in minutes
    cities: string[];
  };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isBookable(): boolean {
    return this.status === FlightStatus.SCHEDULED && 
           Object.values(this.pricing).some(p => p.available > 0);
  }

  get totalSeatsAvailable(): number {
    return Object.values(this.pricing).reduce((sum, p) => sum + p.available, 0);
  }

  get isDirect(): boolean {
    return !this.stopover || this.stopover.airports.length === 0;
  }

  get formattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }
}
