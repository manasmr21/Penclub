import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function resolveMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
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
