import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum TourStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  DRAFT = 'draft'
}

export enum TourDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
  DIFFICULT = 'difficult'
}

export enum TourType {
  CULTURAL = 'cultural',
  ADVENTURE = 'adventure',
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  FOOD = 'food',
  HISTORICAL = 'historical',
  NATURE = 'nature',
  LUXURY = 'luxury',
  BUDGET = 'budget'
}

@Entity('tours')
@Index(['status'])
@Index(['type'])
@Index(['destination'])
@Index(['price'])
@Index(['rating'])
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({
    type: 'enum',
    enum: TourStatus,
    default: TourStatus.ACTIVE
  })
  status: TourStatus;

  @Column({
    type: 'enum',
    enum: TourType
  })
  type: TourType;

  @Column({
    type: 'enum',
    enum: TourDifficulty,
    default: TourDifficulty.EASY
  })
  difficulty: TourDifficulty;

  @Column({ type: 'varchar', length: 255 })
  destination: string;

  @Column({ type: 'varchar', length: 255 })
  departureLocation: string;

  @Column({ type: 'int' })
  duration: number; // số ngày

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'int', default: 0 })
  maxParticipants: number;

  @Column({ type: 'int', default: 1 })
  minParticipants: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'jsonb' })
  images: string[]; // Array of image URLs

  @Column({ type: 'jsonb' })
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];

  @Column({ type: 'jsonb' })
  included: string[]; // Những gì bao gồm trong tour

  @Column({ type: 'jsonb' })
  excluded: string[]; // Những gì không bao gồm

  @Column({ type: 'jsonb', nullable: true })
  schedule: {
    startTime: string;
    endTime: string;
    pickupPoints?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  requirements: {
    age?: { min?: number; max?: number };
    fitness?: string;
    equipment?: string[];
    documents?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  cancellationPolicy: {
    beforeDays: number;
    refundPercentage: number;
    description: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    city: string;
    country: string;
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
  get averageRating(): number {
    return this.reviewCount > 0 ? this.rating : 0;
  }

  get isBookable(): boolean {
    return this.status === TourStatus.ACTIVE && this.maxParticipants > 0;
  }
}
