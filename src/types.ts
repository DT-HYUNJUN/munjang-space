export interface IReport {
  id: string;
  author: string;
  book: IBook;
  content: string;
  date: number;
  isPrivate: boolean;
  like: number;
  profileImage: string;
  star: number;
  title: string;
  username: string;
  email?: string;
}

export interface IBook {
  isbn13: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  bestRank?: number;
  categoryName?: string;
  link?: string;
}

export interface IUserInfo {
  email: string;
  photoURL: string;
  username: string;
}
