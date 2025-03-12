import { HeaderStyle, FooterStyle, ContentWidth } from '../dto/theme-settings.dto';

export interface ITheme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  version: string;
  author: string;
  category: 'business' | 'portfolio' | 'blog' | 'ecommerce' | 'landing' | 'personal';
  isActive: boolean;
  isPremium: boolean;
  price?: number;
  supportedFeatures: string[];
  templates: {
    [key: string]: string;
  };
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
      headerStyle: HeaderStyle;
      footerStyle: FooterStyle;
      contentWidth: ContentWidth;
    };
    animations?: {
      pageTransition?: string;
      elementAnimations?: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IThemeWithStats extends ITheme {
  usageCount: number;
  rating: number;
  reviewCount: number;
}
