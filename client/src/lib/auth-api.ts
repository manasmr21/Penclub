import { api } from "./api";
import { type AuthUser, type UserRole } from "./auth";

type AuthPayload = {
  name?: string;
  penName?: string;
  username?: string;
  email?: string;
  password: string;
  identifier?: string;
  profilePicture?: string;
  profilePictureFile?: File;
};

type SharedProfilePayload = {
  interests?: string[];
  profilePicture?: string;
  bio?: string;
};

type ReaderProfilePayload = SharedProfilePayload & {
  phoneNumber?: string;
};

type AuthorProfilePayload = SharedProfilePayload;

function rolePath(role: UserRole) {
  return role === "author" ? "authors" : "readers";
}

export async function registerUser(role: UserRole, payload: AuthPayload) {
  const path = role === "author" ? "create" : "register";
  const profilePictureFile = payload.profilePictureFile;
  const hasProfileFile = profilePictureFile instanceof File;

  if (hasProfileFile) {
    const formData = new FormData();

    if (payload.name) formData.append("name", payload.name);
    if (payload.penName) formData.append("penName", payload.penName);
    if (payload.username) formData.append("username", payload.username);
    if (payload.email) formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("profilePicture", profilePictureFile);

    const { data } = await api.post(`/${rolePath(role)}/${path}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  const { data } = await api.post(`/${rolePath(role)}/${path}`, payload);
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
  const path = role === "author" ? "verify-otp" : "verify-email";
  const { data } = await api.post(`/${rolePath(role)}/${path}`, { email, otp });
  return data;
}

export async function resendUserOtp(role: UserRole, email: string) {
  if (role !== "author") {
    throw new Error("Resend OTP is not available for readers in the current server API.");
  }

  const { data } = await api.post(`/${rolePath(role)}/resend-otp`, { email });
  return data;
}

export async function updateUserProfile(
  user: AuthUser,
  payload: ReaderProfilePayload | AuthorProfilePayload,
) {
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
