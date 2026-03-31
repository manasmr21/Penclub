import { api } from "./api";

export type CreateBookPayload = {
  title: string;
  description: string;
  genre: string;
  authorId: string;
  releaseDate?: string;
  purchaseLinks?: string[];
  coverImageFile?: File;
};

function toPostgresTextArrayLiteral(values: string[]) {
  const escaped = values.map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  return `{${escaped.join(",")}}`;
}

export async function createBook(payload: CreateBookPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("genre", payload.genre);
  formData.append("authorId", payload.authorId);

  if (payload.releaseDate) {
    formData.append("releaseDate", payload.releaseDate);
  }

  if (payload.purchaseLinks?.length) {
    formData.append("purchaseLinks", toPostgresTextArrayLiteral(payload.purchaseLinks));
  }

  if (payload.coverImageFile instanceof File) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const { data } = await api.post("/books/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
