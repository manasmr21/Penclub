import { api } from "./http-client";
import type { AuthorBook } from "./profile-stats-api";
import { AxiosError } from "axios";

export type CreateBookPayload = {
  title: string;
  description: string;
  genre: string;
  releaseDate?: string;
  purchaseLinks?: string[];
  coverImageFile?: File;
};

export type CreateArticlePayload = {
  title: string;
  content: string;
  tags?: string[];
  userId: string;
  status?: string;
  coverImageFile?: File;
};

export type UpdateBookPayload = {
  title?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  purchaseLinks?: string[];
  coverImageFile?: File;
};

export type UpdateArticlePayload = {
  title?: string;
  content?: string;
  tags?: string[];
  status?: string;
  coverImageFile?: File;
};

type BooksPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function fetchAllBooks(page = 1, limit = 10): Promise<{ books: AuthorBook[]; pagination: BooksPagination | null }> {
  const { data } = await api.get<{ books?: AuthorBook[]; pagination?: BooksPagination }>(`/books?page=${page}&limit=${limit}`);

  return {
    books: Array.isArray(data?.books) ? data.books : [],
    pagination: data?.pagination ?? null,
  };
}

export async function fetchBookById(bookId: string): Promise<AuthorBook | null> {
  try {
    const { data } = await api.get<{ book?: AuthorBook }>(`/books/${bookId}`);

    return data?.book ?? null;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchAuthorNameById(authorId: string): Promise<string | null> {
  if (!authorId?.trim()) return null;

  try {
    const { data } = await api.get<{ blogs?: Array<{ user?: { name?: string; username?: string } }> }>(
      `/blogs/fetch/${authorId}`,
    );

    const firstUser = data?.blogs?.[0]?.user;
    const name = firstUser?.name?.trim();
    const username = firstUser?.username?.trim();
    if (name || username) return name || username || null;
  } catch (error) {
    if (!(error instanceof AxiosError && error.response?.status === 404)) {
      throw error;
    }
  }

  try {
    const { data } = await api.get<{ author?: { name?: string; penName?: string } }>(
      `/authors/get-author/${authorId}`,
    );

    const name = data?.author?.name?.trim();
    const penName = data?.author?.penName?.trim();
    return name || penName || null;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export type BookReview = {
  id: string;
  rating: number;
  content?: string;
  createdAt?: string;
  user?: {
    id: string;
    name?: string;
    username?: string;
  };
};

export async function fetchReviewsByBook(bookId: string): Promise<BookReview[]> {
  try {
    const { data } = await api.get<{ reviews?: BookReview[] }>(`/reviews/get-book/${bookId}`);

    return Array.isArray(data?.reviews) ? data.reviews : [];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function createBookReview(payload: { bookId: string; rating: number; content?: string }) {
  const { data } = await api.post("/reviews/create", payload);
  return data;
}

export async function updateBookReview(reviewId: string, payload: { rating?: number; content?: string }) {
  const { data } = await api.put(`/reviews/update/${reviewId}`, payload);
  return data;
}

export async function createBook(payload: CreateBookPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("genre", payload.genre);

  if (payload.releaseDate) {
    formData.append("releaseDate", payload.releaseDate);
  }

  if (payload.purchaseLinks?.length) {
    payload.purchaseLinks.forEach((link) => {
      formData.append("purchaseLinks", link);
    });
  }

  if (payload.coverImageFile) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const { data } = await api.post("/books/create", formData);
  return data;
}

export async function createArticle(payload: CreateArticlePayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("userId", payload.userId);
  formData.append("status", payload.status ?? "posted");

  if (payload.tags?.length) {
    payload.tags.forEach((tag) => {
      formData.append("tags", tag);
    });
  }

  if (payload.coverImageFile) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const { data } = await api.post("/blogs/create", formData);
  return data;
}

export async function updateBook(bookId: string, payload: UpdateBookPayload) {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.genre !== undefined) formData.append("genre", payload.genre);
  if (payload.releaseDate !== undefined) formData.append("releaseDate", payload.releaseDate);

  if (payload.purchaseLinks?.length) {
    payload.purchaseLinks.forEach((link) => formData.append("purchaseLinks", link));
  }

  if (payload.coverImageFile) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const { data } = await api.put(`/books/update/${bookId}`, formData);
  return data;
}

export async function deleteBook(bookId: string) {
  const { data } = await api.delete(`/books/delete/${bookId}`);
  return data;
}

export async function updateArticle(articleId: string, payload: UpdateArticlePayload) {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined) formData.append("content", payload.content);
  if (payload.status !== undefined) formData.append("status", payload.status);

  if (payload.tags?.length) {
    payload.tags.forEach((tag) => formData.append("tags", tag));
  }

  if (payload.coverImageFile) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const { data } = await api.put(`/blogs/update/${articleId}`, formData);
  return data;
}

export async function deleteArticle(articleId: string, coverImageId?: string) {
  const { data } = await api.delete(`/blogs/delete/${articleId}`, {
    data: {
      coverImageId: coverImageId ?? "",
    },
  });
  return data;
}
