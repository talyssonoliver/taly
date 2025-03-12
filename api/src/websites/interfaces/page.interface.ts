export interface IPage {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  path: string;
  isHomePage: boolean;
  isPublished: boolean;
  sortOrder: number;
  content: {
    sections: {
      id: string;
      type: string;
      data: any;
      settings?: any;
    }[];
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastPublishedAt?: Date;
}

export interface IPageSection {
  id: string;
  type: string;
  data: any;
  settings?: any;
}

export interface IPageWithWebsite extends IPage {
  website: {
    id: string;
    name: string;
    url: string;
    isPublished: boolean;
  };
}
