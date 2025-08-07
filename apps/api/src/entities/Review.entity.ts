import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ReviewType {
  TOUR = 'tour',
  FLIGHT = 'flight', 
  HOTEL = 'hotel',
  CAR_RENTAL = 'car_rental',
  DRIVER_SERVICE = 'driver_service'
}

@Entity('reviews')
@Index(['serviceType'])
@Index(['serviceId'])
@Index(['userId'])
@Index(['status'])
@Index(['rating'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({
    type: 'enum',
    enum: ReviewType
  })
  serviceType: ReviewType;

  @Column({ type: 'varchar', length: 255 })
  serviceId: string; // ID của tour, hotel, flight, etc.

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING
  })
  status: ReviewStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userName: string; // Cached from user

  @Column({ type: 'varchar', length: 255, nullable: true })
  serviceName: string; // Cached service name

  @Column({ type: 'timestamp', nullable: true })
  experienceDate: Date; // Ngày trải nghiệm dịch vụ

  @Column({ type: 'varchar', length: 255, nullable: true })
  moderatedBy: string; // Admin who approved/rejected

  @Column({ type: 'text', nullable: true })
  moderationNote: string;

  @Column({ type: 'timestamp', nullable: true })
  moderatedAt: Date;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number; // Số người thấy review hữu ích

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isApproved(): boolean {
    return this.status === ReviewStatus.APPROVED;
  }

  get hasImages(): boolean {
    return this.images && this.images.length > 0;
  }
}
