import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Website } from './website.entity';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  websiteId: string;

  @ManyToOne(() => Website, website => website.pages)
  @JoinColumn({ name: 'websiteId' })
  website: Website;

  @Column()
  title: string;

  @Column()
  @Index()
  slug: string;

  @Column()
  path: string;

  @Column({ default: false })
  isHomePage: boolean;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column('jsonb')
  content: {
    sections: {
      id: string;
      type: string;
      data: any;
      settings?: any;
    }[];
  };

  @Column('jsonb', { nullable: true })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastPublishedAt?: Date;
}
