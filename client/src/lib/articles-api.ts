import { api } from "./http-client";

export type CreateArticlePayload = {
  title: string;
  content: string;
  tags?: string[];
  userId: string;
  status?: string;
  coverImageFile?: File;
};

export type UpdateArticlePayload = {
  title?: string;
  content?: string;
  tags?: string[];
  status?: string;
  coverImageFile?: File;
};

type ArticlesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicArticle = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  coverImageId?: string;
  userId?: string;
  createdAt?: string;
};

function appendMany(formData: FormData, key: string, values?: string[]) {
  if (!values?.length) return;
  values.forEach((value) => formData.append(key, value));
}

function buildArticleFormData(payload: CreateArticlePayload | UpdateArticlePayload) {
  const formData = new FormData();

  if ("userId" in payload) {
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("userId", payload.userId);
    formData.append("status", payload.status ?? "posted");
  } else {
    if (payload.title !== undefined) formData.append("title", payload.title);
    if (payload.content !== undefined) formData.append("content", payload.content);
    if (payload.status !== undefined) formData.append("status", payload.status);
  }

  appendMany(formData, "tags", payload.tags);

  if (payload.coverImageFile) {
    formData.append("coverImage", payload.coverImageFile);
  }

  return formData;
}

export async function fetchAllArticles(
  page = 1,
  limit = 10,
): Promise<{ articles: PublicArticle[]; pagination: ArticlesPagination | null }> {
  const { data } = await api.get<{ blogs?: PublicArticle[]; pagination?: ArticlesPagination }>(
    `/blogs?page=${page}&limit=${limit}`,
  );
  return {
    articles: Array.isArray(data?.blogs) ? data.blogs : [],
    pagination: data?.pagination ?? null,
  };
}

export async function createArticle(payload: CreateArticlePayload) {
  const formData = buildArticleFormData(payload);
  const { data } = await api.post("/blogs/create", formData);
  return data;
}

export async function updateArticle(articleId: string, payload: UpdateArticlePayload) {
  const formData = buildArticleFormData(payload);
  const { data } = await api.put(`/blogs/update/${articleId}`, formData);
  return data;
}

export async function deleteArticle(articleId: string, coverImageId?: string) {
  const { data } = await api.delete(`/blogs/delete/${articleId}`, {
    data: { coverImageId: coverImageId ?? "" },
  });
  return data;
}
