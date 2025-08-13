import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ContactStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum ContactType {
  GENERAL_INQUIRY = 'general_inquiry',
  BOOKING_SUPPORT = 'booking_support',
  COMPLAINT = 'complaint',
  PARTNERSHIP = 'partnership',
  TECHNICAL_SUPPORT = 'technical_support'
}

@Entity('contacts')
@Index(['status'])
@Index(['type'])
@Index(['createdAt'])
@Index(['email'])
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string;

  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.GENERAL_INQUIRY
  })
  type: ContactType;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.NEW
  })
  status: ContactStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedTo: string; // Admin user who handles this

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referrer: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isResolved(): boolean {
    return this.status === ContactStatus.RESOLVED || this.status === ContactStatus.CLOSED;
  }

  get responseTime(): number | null {
    if (!this.respondedAt) return null;
    return Math.round((this.respondedAt.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60)); // hours
  }
}
