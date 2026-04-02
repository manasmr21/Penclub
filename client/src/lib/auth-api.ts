import { api } from "./api";
import { type LoginPayload } from "./auth";
import { type AuthUser } from "./store/store";

export async function registerUser(payload: FormData) {
  const { data } = await api.post("/users/create", payload);
  return data;
}

export async function verifyUserOtp(email: string, otp: string) {
  const { data } = await api.post("/users/verify", { email, otp })
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post("/users/login", payload);
  return data;
}

export async function resendUserOtp(role: string, email: string) {
  void role;
  const { data } = await api.post("/users/resend", { email });
  return data;
}

export async function updateUserProfile(userId: string, payload: FormData) {
  const { data } = await api.put(`/users/update/${userId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function logoutUser(role: string) {
  void role;
  const { data } = await api.post("/users/logout");
  return data;
}
