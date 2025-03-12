import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  version: string;

  @Column()
  author: string;

  @Column({
    type: 'enum',
    enum: ['business', 'portfolio', 'blog', 'ecommerce', 'landing', 'personal']
  })
  category: 'business' | 'portfolio' | 'blog' | 'ecommerce' | 'landing' | 'personal';

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true, type: 'decimal' })
  price?: number;

  @Column('text', { array: true })
  supportedFeatures: string[];

  @Column('jsonb')
  templates: {
    [key: string]: string;
  };

  @Column('jsonb')
  defaultSettings: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent?: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: {
      headerStyle: string;
      footerStyle: string;
      contentWidth: string;
    };
    animations?: {
      pageTransition?: string;
      elementAnimations?: boolean;
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
