import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum HotelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  FAMILY = 'family',
  PRESIDENTIAL = 'presidential'
}

export enum HotelCategory {
  HOTEL = 'hotel',
  RESORT = 'resort',
  HOSTEL = 'hostel',
  APARTMENT = 'apartment',
  VILLA = 'villa',
  HOMESTAY = 'homestay'
}

@Entity('hotels')
@Index(['name'])
@Index(['city'])
@Index(['status'])
@Index(['starRating'])
@Index(['rating'])
@Index(['category'])
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: HotelStatus,
    default: HotelStatus.ACTIVE
  })
  status: HotelStatus;

  @Column({
    type: 'enum',
    enum: HotelCategory
  })
  category: HotelCategory;

  @Column({ type: 'int', default: 3 })
  starRating: number; // 1-5 stars

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // Guest rating

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'jsonb' })
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    landmarks?: {
      name: string;
      distance: number; // km
    }[];
  };

  @Column({ type: 'jsonb' })
  images: string[]; // Array of image URLs

  @Column({ type: 'jsonb' })
  rooms: {
    type: RoomType;
    name: string;
    description: string;
    images: string[];
    amenities: string[];
    capacity: {
      adults: number;
      children: number;
      beds: number;
    };
    size: number; // m²
    pricing: {
      basePrice: number;
      currency: string;
      taxes?: number;
      fees?: number;
    };
    availability: {
      total: number;
      available: number;
    };
  }[];

  @Column({ type: 'jsonb' })
  amenities: {
    general: string[];
    business: string[];
    wellness: string[];
    dining: string[];
    transportation: string[];
    activities: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  policies: {
    checkIn: {
      from: string;
      to: string;
    };
    checkOut: {
      from: string;
      to: string;
    };
    cancellation: {
      freeUntil: number; // hours before check-in
      penalty: number; // percentage
      terms: string;
    };
    children: string;
    pets: string;
    smoking: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  dining: {
    restaurants: {
      name: string;
      cuisine: string;
      openingHours: string;
      priceRange: string;
    }[];
    roomService: boolean;
    barLounge: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  contact: {
    phone: string;
    email: string;
    website?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  transportation: {
    airportShuttle: boolean;
    parking: {
      available: boolean;
      free: boolean;
      price?: number;
    };
    publicTransport: {
      nearest: string;
      distance: number; // meters
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    slug?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isBookable(): boolean {
    return this.status === HotelStatus.ACTIVE && 
           this.rooms.some(room => room.availability.available > 0);
  }

  get totalRooms(): number {
    return this.rooms.reduce((sum, room) => sum + room.availability.total, 0);
  }

  get availableRooms(): number {
    return this.rooms.reduce((sum, room) => sum + room.availability.available, 0);
  }

  get startingPrice(): number {
    return Math.min(...this.rooms.map(room => room.pricing.basePrice));
  }

  get city(): string {
    return this.location.city;
  }
}
