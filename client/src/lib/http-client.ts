import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function shouldFallbackToFetch(error: unknown) {
  return error instanceof AxiosError && !error.response;
}

function resolveMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

async function parseFetchResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

function normalizeFetchBody(body: unknown) {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData) return body;
  if (typeof body === "string") return body;
  return JSON.stringify(body);
}

function buildFetchHeaders(headers?: Record<string, string>, body?: unknown) {
  if (body instanceof FormData) {
    return headers;
  }

  return {
    "content-type": "application/json",
    ...headers,
  };
}

export async function requestWithFallback<T>({
  axiosRequest,
  path,
  method,
  body,
  headers,
}: {
  axiosRequest: () => Promise<{ data: T }>;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}) {
  try {
    const { data } = await axiosRequest();
    return data;
  } catch (error) {
    if (!shouldFallbackToFetch(error)) {
      throw error;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: buildFetchHeaders(headers, body),
      body: normalizeFetchBody(body),
    });

    const data = await parseFetchResponse(response);

    if (!response.ok) {
      throw new Error(resolveMessage(data, `Request failed with status ${response.status}`));
    }

    return data as T;
  }
}

export function extractErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    return resolveMessage(error.response?.data, error.message || fallback);
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export type { AxiosRequestConfig };
