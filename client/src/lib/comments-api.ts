import { api } from "./http-client";

export type CommentUser = {
  id: string;
  name: string;
  username: string;
  role: string;
};

export type BlogComment = {
  id: string;
  content: string;
  edited: boolean;
  userId: string;
  blogId: string;
  parentId: string | null;
  createdAt: string;
  user: CommentUser;
  replies?: BlogComment[];
};

export type CreateCommentPayload = {
  content: string;
  blogId: string;
  parentId?: string;
};

export type UpdateCommentPayload = {
  content: string;
  blogId: string;
};

export async function fetchCommentsByBlogId(blogId: string): Promise<BlogComment[]> {
  try {
    const { data } = await api.get<{ success: boolean; comment: BlogComment[] }>(`/comments/get-blog/${blogId}`);
    return data?.success ? data.comment : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(payload: CreateCommentPayload) {
  const { data } = await api.post("/comments/create", payload);
  return data;
}

export async function updateComment(commentId: string, payload: UpdateCommentPayload) {
  const { data } = await api.put(`/comments/update/${commentId}`, payload);
  return data;
}

export async function deleteComment(commentId: string, blogId: string) {
  const { data } = await api.delete(`/comments/delete/${commentId}`, {
    data: { blogId },
  });
  return data;
}
