import { ITheme } from './theme.interface';
import { IPage } from './page.interface';
import { ThemeSettingsDto } from '../dto';
import { CustomDomainDto } from '../dto';

export interface IWebsite {
  id: string;
  name: string;
  description?: string;
  themeId: string;
  theme?: ITheme;
  pages?: IPage[];
  isPublished: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  themeSettings: ThemeSettingsDto;
  customDomain?: CustomDomainDto;
  publishedAt?: Date;
  settings?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    analytics?: {
      googleAnalyticsId?: string;
      facebookPixelId?: string;
    };
    social?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  analytics?: {
    visits: number;
    uniqueVisitors: number;
    pageViews: number;
    lastUpdated?: Date;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}

export interface WebsiteWithRelations extends IWebsite {
  theme: ITheme;
  pages: IPage[];
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}
