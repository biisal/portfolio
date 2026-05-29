export type CommentUser = {
  name: string;
  image: string | null;
};

export type CommentType = {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
};
