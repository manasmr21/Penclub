import { api } from "./http-client";
import type { AuthorBook } from "./profile-stats-api";

export type CreateBookPayload = {
  title: string;
  description: string;
  genre: string;
  authorname: string;
  releaseDate?: string;
  purchaseLinks?: string[];
  coverImageFile?: File;
  coverImageFiles?: File[];
};

export type UpdateBookPayload = {
  title?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  purchaseLinks?: string[];
  coverImageFile?: File;
  coverImageFiles?: File[];
};

type BooksPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

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

const okOrNotFound = (status: number) => status === 200 || status === 404;

function appendMany(formData: FormData, key: string, values?: string[]) {
  if (!values?.length) return;
  values.forEach((value) => formData.append(key, value));
}

function appendBookFiles(
  formData: FormData,
  files?: File[],
  singleFile?: File,
) {
  const nextFiles = files?.length ? files : singleFile ? [singleFile] : [];
  nextFiles.forEach((file) => formData.append("files", file));
}

export async function fetchAllBooks(
  page = 1,
  limit = 10,
): Promise<{ books: AuthorBook[]; pagination: BooksPagination | null }> {
  const { data } = await api.get<{ books?: AuthorBook[]; pagination?: BooksPagination }>(
    `/books?page=${page}&limit=${limit}`,
  );
  return {
    books: Array.isArray(data?.books) ? data.books : [],
    pagination: data?.pagination ?? null,
  };
}

export async function fetchBookById(bookId: string): Promise<AuthorBook | null> {
  const response = await api.get<{ book?: AuthorBook }>(`/books/${bookId}`, {
    validateStatus: okOrNotFound,
  });
  if (response.status === 404) return null;
  return response.data?.book ?? null;
}

export async function fetchAuthorNameById(authorId: string): Promise<string | null> {
  if (!authorId?.trim()) return null;

  const blogResponse = await api.get<{ blogs?: Array<{ user?: { name?: string; username?: string } }> }>(
    `/blogs/fetch/${authorId}`,
    { validateStatus: okOrNotFound },
  );
  if (blogResponse.status !== 404) {
    const firstUser = blogResponse.data?.blogs?.[0]?.user;
    const name = firstUser?.name?.trim();
    const username = firstUser?.username?.trim();
    if (name || username) return name || username || null;
  }

  const authorResponse = await api.get<{ author?: { name?: string; penName?: string } }>(
    `/authors/get-author/${authorId}`,
    { validateStatus: okOrNotFound },
  );
  if (authorResponse.status === 404) return null;

  const name = authorResponse.data?.author?.name?.trim();
  const penName = authorResponse.data?.author?.penName?.trim();
  return name || penName || null;
}

export async function fetchReviewsByBook(bookId: string): Promise<BookReview[]> {
  const response = await api.get<{ reviews?: BookReview[] }>(`/reviews/get-book/${bookId}`, {
    validateStatus: okOrNotFound,
  });
  if (response.status === 404) return [];
  return Array.isArray(response.data?.reviews) ? response.data.reviews : [];
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
  formData.append("authorname", payload.authorname);

  if (payload.releaseDate) formData.append("releaseDate", payload.releaseDate);
  appendMany(formData, "purchaseLinks", payload.purchaseLinks);
  appendBookFiles(formData, payload.coverImageFiles, payload.coverImageFile);

  const { data } = await api.post("/books/create", formData);
  return data;
}

export async function updateBook(bookId: string, payload: UpdateBookPayload) {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.genre !== undefined) formData.append("genre", payload.genre);
  if (payload.releaseDate !== undefined) formData.append("releaseDate", payload.releaseDate);
  appendMany(formData, "purchaseLinks", payload.purchaseLinks);
  appendBookFiles(formData, payload.coverImageFiles, payload.coverImageFile);

  const { data } = await api.put(`/books/update/${bookId}`, formData);
  return data;
}

export async function deleteBook(bookId: string) {
  const { data } = await api.delete(`/books/delete/${bookId}`);
  return data;
}
