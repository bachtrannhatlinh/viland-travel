import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum PartnerStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated'
}

export enum PartnerType {
  AIRLINE = 'airline',
  HOTEL_CHAIN = 'hotel_chain',
  TOUR_OPERATOR = 'tour_operator',
  CAR_RENTAL = 'car_rental',
  DRIVER_SERVICE = 'driver_service',
  PAYMENT_GATEWAY = 'payment_gateway',
  INSURANCE = 'insurance'
}

@Entity('partners')
@Index(['status'])
@Index(['type'])
@Index(['featured'])
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PartnerType
  })
  type: PartnerType;

  @Column({
    type: 'enum',
    enum: PartnerStatus,
    default: PartnerStatus.PENDING
  })
  status: PartnerStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'boolean', default: false })
  featured: boolean; // Hiển thị trên trang chủ

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number; // Commission percentage

  @Column({ type: 'jsonb', nullable: true })
  contractDetails: {
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    terms?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  apiCredentials: {
    apiKey?: string;
    secretKey?: string;
    endpoint?: string;
    environment?: string; // sandbox, production
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === PartnerStatus.ACTIVE;
  }

  get isFeatured(): boolean {
    return this.featured && this.isActive;
  }
}
