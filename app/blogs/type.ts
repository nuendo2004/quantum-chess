interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  published: boolean;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags: string[];
}

export type { BlogPost };
