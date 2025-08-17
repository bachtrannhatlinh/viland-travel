import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum NewsStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum NewsCategory {
  NEWS = 'news',
  TRAVEL_TIPS = 'travel_tips',
  DESTINATION_GUIDE = 'destination_guide',
  COMPANY_NEWS = 'company_news',
  CUSTOMER_STORY = 'customer_story'
}

@Entity('news')
@Index(['status'])
@Index(['category'])
@Index(['publishedAt'])
@Index(['featured'])
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: NewsStatus,
    default: NewsStatus.DRAFT
  })
  status: NewsStatus;

  @Column({
    type: 'enum',
    enum: NewsCategory
  })
  category: NewsCategory;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featuredImage: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isPublished(): boolean {
    return this.status === NewsStatus.PUBLISHED && this.publishedAt <= new Date();
  }

  get readingTime(): number {
    // Estimate reading time (words per minute: 200)
    const wordCount = this.content.split(' ').length;
    return Math.ceil(wordCount / 200);
  }
}
