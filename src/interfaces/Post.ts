export default interface Post {
  id: number;
  authorId: number;
  type: string;
  created: string;
  comments: number;
  data: string; // JSON string with title, author, blurb, content
}