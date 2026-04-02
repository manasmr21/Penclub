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

export type UpdateUserProfilePayload = {
  interests?: string[];
  bio?: string;
  profilePicture?: string;
  profilePictureFile?: File;
};

export async function updateUserProfile(
  user: Pick<AuthUser, "id" | "profilePictureId">,
  payload: UpdateUserProfilePayload,
) {
  const formData = new FormData();

  if (payload.bio !== undefined) {
    formData.append("bio", payload.bio);
  }

  if (payload.interests?.length) {
    payload.interests.forEach((interest) => {
      formData.append("interests", interest);
      formData.append("interest", interest);
    });
  }

  if (payload.profilePictureFile) {
    formData.append("profilePicture", payload.profilePictureFile);
    if (user.profilePictureId) {
      formData.append("profilePictureId", user.profilePictureId);
    }
  } else if (payload.profilePicture !== undefined) {
    formData.append("profilePicture", payload.profilePicture);
  }

  const { data } = await api.put(`/users/update/${user.id}`, formData, {
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
