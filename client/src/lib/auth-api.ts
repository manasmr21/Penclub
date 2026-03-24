import { api } from "./api";
import { type AuthUser, type UserRole } from "./auth";

type AuthPayload = {
  name?: string;
  penName?: string;
  username?: string;
  email?: string;
  password: string;
  identifier?: string;
};

type UpdateProfilePayload = {
  interests?: string[];
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
};

function rolePath(role: UserRole) {
  return role === "author" ? "authors" : "readers";
}

export async function registerUser(role: UserRole, payload: AuthPayload) {
  const { data } = await api.post(`/${rolePath(role)}/create`, payload);
  return data;
}

export async function loginUser(role: UserRole, payload: AuthPayload) {
  const { data } = await api.post(`/${rolePath(role)}/login`, {
    identifier: payload.identifier,
    password: payload.password,
  });
  return data;
}

export async function verifyUserOtp(role: UserRole, email: string, otp: string) {
  const { data } = await api.post(`/${rolePath(role)}/verify-otp`, { email, otp });
  return data;
}

export async function resendUserOtp(role: UserRole, email: string) {
  const { data } = await api.post(`/${rolePath(role)}/resend-otp`, { email });
  return data;
}

export async function updateUserProfile(user: AuthUser, payload: UpdateProfilePayload) {
  const { data } = await api.put(`/${rolePath(user.role)}/update/${user.id}`, payload);
  return data;
}

export async function logoutUser(role: UserRole) {
  try {
    await api.post(`/${rolePath(role)}/logout`);
  } catch {
    // Clear client state even if the cookie clear request fails.
  }
}
