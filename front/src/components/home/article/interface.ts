export interface ArticleProps {
  id: string;
  title: string;
  createTime: string;
  tags: string[];
  category: string;
  is_new: boolean;
  bgPicture: string;
  comment: number;
}
