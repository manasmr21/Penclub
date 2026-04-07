import { api, requestWithFallback } from "./http-client";
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

export async function fetchAllBooks(): Promise<AuthorBook[]> {
  const data = await requestWithFallback<{ books?: AuthorBook[] }>({
    axiosRequest: () => api.get("/books"),
    path: "/books",
    method: "GET",
  });

  return Array.isArray(data?.books) ? data.books : [];
}

export async function fetchBookById(bookId: string): Promise<AuthorBook | null> {
  try {
    const data = await requestWithFallback<{ book?: AuthorBook }>({
      axiosRequest: () => api.get(`/books/${bookId}`),
      path: `/books/${bookId}`,
      method: "GET",
    });

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
    const data = await requestWithFallback<{ blogs?: Array<{ user?: { name?: string; username?: string } }> }>({
      axiosRequest: () => api.get(`/blogs/fetch/${authorId}`),
      path: `/blogs/fetch/${authorId}`,
      method: "GET",
    });

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
    const data = await requestWithFallback<{ author?: { name?: string; penName?: string } }>({
      axiosRequest: () => api.get(`/authors/get-author/${authorId}`),
      path: `/authors/get-author/${authorId}`,
      method: "GET",
    });

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
    const data = await requestWithFallback<{ reviews?: BookReview[] }>({
      axiosRequest: () => api.get(`/reviews/get-book/${bookId}`),
      path: `/reviews/get-book/${bookId}`,
      method: "GET",
    });

    return Array.isArray(data?.reviews) ? data.reviews : [];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function createBookReview(payload: { bookId: string; rating: number; content?: string }) {
  return requestWithFallback({
    axiosRequest: () => api.post("/reviews/create", payload),
    path: "/reviews/create",
    method: "POST",
    body: payload,
  });
}

export async function updateBookReview(reviewId: string, payload: { rating?: number; content?: string }) {
  return requestWithFallback({
    axiosRequest: () => api.put(`/reviews/update/${reviewId}`, payload),
    path: `/reviews/update/${reviewId}`,
    method: "PUT",
    body: payload,
  });
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

  return requestWithFallback({
    axiosRequest: () => api.post("/books/create", formData),
    path: "/books/create",
    method: "POST",
    body: formData,
  });
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

  return requestWithFallback({
    axiosRequest: () => api.post("/blogs/create", formData),
    path: "/blogs/create",
    method: "POST",
    body: formData,
  });
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

  return requestWithFallback({
    axiosRequest: () => api.put(`/books/update/${bookId}`, formData),
    path: `/books/update/${bookId}`,
    method: "PUT",
    body: formData,
  });
}

export async function deleteBook(bookId: string) {
  return requestWithFallback({
    axiosRequest: () => api.delete(`/books/delete/${bookId}`),
    path: `/books/delete/${bookId}`,
    method: "DELETE",
  });
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

  return requestWithFallback({
    axiosRequest: () => api.put(`/blogs/update/${articleId}`, formData),
    path: `/blogs/update/${articleId}`,
    method: "PUT",
    body: formData,
  });
}

export async function deleteArticle(articleId: string, coverImageId?: string) {
  return requestWithFallback({
    axiosRequest: () =>
      api.delete(`/blogs/delete/${articleId}`, {
        data: {
          coverImageId: coverImageId ?? "",
        },
      }),
    path: `/blogs/delete/${articleId}`,
    method: "DELETE",
    body: {
      coverImageId: coverImageId ?? "",
    },
  });
}
