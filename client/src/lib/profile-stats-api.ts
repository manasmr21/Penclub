import { AxiosError } from "axios";
import { api } from "./api";

function isNotFoundError(error: unknown) {
  return error instanceof AxiosError && error.response?.status === 404;
}

export type AuthorBook = {
  id: string;
  title: string;
  description: string;
  genre: string;
  coverImage?: string;
};

export type AuthorArticle = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  createdAt?: string;
};

export async function fetchAuthorBooks(authorId: string): Promise<AuthorBook[]> {
  try {
    const { data } = await api.get(`/books/author/${authorId}`);
    return Array.isArray(data?.books) ? (data.books as AuthorBook[]) : [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    throw error;
  }
}

export async function fetchAuthorArticles(authorId: string): Promise<AuthorArticle[]> {
  try {
    const { data } = await api.get(`/blogs/fetch/${authorId}`);
    return Array.isArray(data?.blogs) ? (data.blogs as AuthorArticle[]) : [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    throw error;
  }
}

export async function fetchAuthorBooksCount(authorId: string): Promise<number> {
  try {
    const { data } = await api.get(`/books/author/${authorId}?page=1&limit=1`);
    if (typeof data?.pagination?.total === "number") {
      return data.pagination.total as number;
    }

    return Array.isArray(data?.books) ? (data.books as AuthorBook[]).length : 0;
  } catch (error) {
    if (isNotFoundError(error)) {
      return 0;
    }
    throw error;
  }
}

export async function fetchAuthorArticlesCount(authorId: string): Promise<number> {
  try {
    const { data } = await api.get(`/blogs/fetch/${authorId}?page=1&limit=1`);
    if (typeof data?.pagination?.total === "number") {
      return data.pagination.total as number;
    }

    return Array.isArray(data?.blogs) ? (data.blogs as AuthorArticle[]).length : 0;
  } catch (error) {
    if (isNotFoundError(error)) {
      return 0;
    }
    throw error;
  }
}
