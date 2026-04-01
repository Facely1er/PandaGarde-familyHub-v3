// Newsletter content types and interfaces

export interface NewsletterContent {
  id: string;
  month: string;
  year: number;
  title: string;
  featuredTopic: {
    title: string;
    description: string;
    imageUrl?: string;
    articleUrl?: string;
  };
  monthlyTip: {
    title: string;
    content: string;
    linkUrl?: string;
  };
  newActivities: Array<{
    title: string;
    description: string;
    downloadUrl?: string;
    pageUrl?: string;
  }>;
  privacyNews: Array<{
    title: string;
    summary: string;
    linkUrl?: string;
  }>;
  communityHighlight?: {
    title: string;
    content: string;
    author?: string;
    linkUrl?: string;
  };
  resourceSpotlight?: {
    title: string;
    description: string;
    pageUrl: string;
  };
  publishedAt: string;
  featured?: boolean;
}

export interface NewsletterArchive {
  newsletters: NewsletterContent[];
  totalCount: number;
}

