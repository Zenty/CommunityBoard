export default interface Post {
  id: number;
  authorId: number;
  type: string;
  created: string;
  comments: number;
  data: string; // JSON string with title, author, blurb, content
}

export interface CommentData {
  commentId: number;
  authorId: number;
  created: string;
  data: Record<string, any> | string; // depends on your structure
}

export interface PostWithComments extends Post {
  commentsData: CommentData[];
}