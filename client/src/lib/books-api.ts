import { api } from "./api";

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
