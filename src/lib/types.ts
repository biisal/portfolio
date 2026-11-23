export interface BlogPost {
  /** Same as slug; kept so components can use it as a React key. */
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  coverImage: string | null;
  audio: string | null;
  published: boolean;
  tags: string[];
  isProject: boolean;
  created_at: Date;
  updated_at: Date;
}
