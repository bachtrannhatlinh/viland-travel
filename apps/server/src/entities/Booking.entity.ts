import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from './User.entity';
import { Payment } from './Payment.entity';

export enum BookingType {
  TOUR = 'tour',
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  CAR_RENTAL = 'car_rental',
  DRIVER_SERVICE = 'driver_service'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

@Entity('bookings')
@Index(['userId'])
@Index(['bookingNumber'], { unique: true })
@Index(['status'])
@Index(['bookingType'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  bookingNumber: string;

  @Column({
    type: 'enum',
    enum: BookingType
  })
  bookingType: BookingType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  serviceId: string; // ID của tour, hotel, flight, etc.

  @Column({ type: 'jsonb' })
  bookingDetails: {
    serviceName: string;
    description: string;
    duration?: string;
    startDate: string;
    endDate?: string;
    participants: number;
    specialRequests?: string;
    contactInfo: {
      name: string;
      phone: string;
      email: string;
    };
  };

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];

  // Virtual properties
  get remainingAmount(): number {
    return this.totalAmount - this.paidAmount;
  }

  get isFullyPaid(): boolean {
    return this.paidAmount >= this.totalAmount;
  }
}
