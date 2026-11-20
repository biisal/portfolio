export interface BlogPost {
  /** Same as slug; kept so components can use it as a React key. */
  id: string;
  title: string;
  excerpt: string;
  content: string;
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

/** Post metadata as written in `src/data/posts.ts`. */
export interface PostMeta {
  slug: string;
  /** HTML body file inside `content/blog/`. */
  file: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  audio: string | null;
  authorName?: string;
  tags: string[];
  isProject: boolean;
  published: boolean;
  /** ISO date strings. */
  date: string;
  updated?: string;
}
