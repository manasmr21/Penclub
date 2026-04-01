import { api } from "./api";
import { type LoginPayload } from "./auth";

export async function registerUser(payload: FormData) {
  const { data } = await api.post("/users/create", payload);
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post("/users/login", payload);
  return data;
}


export async function verifyUserOtp(role: string, email: string, otp: string) {
  void role;
  void email;
  void otp;
}

export async function resendUserOtp(role: string, email: string) {
  void role;
  void email;
  console.log("aslkdmakl")
}

export async function updateUserProfile() {
  console.log("alksdmkas")
}

export async function logoutUser(role: string) {
  void role;
}
