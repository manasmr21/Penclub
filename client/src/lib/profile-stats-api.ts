import { AxiosError } from "axios";
import { api } from "./api";

function isNotFoundError(error: unknown) {
  return error instanceof AxiosError && error.response?.status === 404;
}

export async function fetchAuthorBooksCount(authorId: string): Promise<number> {
  try {
    const { data } = await api.get(`/books/author/${authorId}`);
    return Array.isArray(data?.books) ? data.books.length : 0;
  } catch (error) {
    if (isNotFoundError(error)) {
      return 0;
    }
    throw error;
  }
}

export async function fetchAuthorArticlesCount(authorId: string): Promise<number> {
  try {
    const { data } = await api.get(`/blogs/fetch/${authorId}`);
    return Array.isArray(data?.blogs) ? data.blogs.length : 0;
  } catch (error) {
    if (isNotFoundError(error)) {
      return 0;
    }
    throw error;
  }
}
