import { api } from "./api";
import { type LoginPayload, type UpdateUserProfilePayload } from "./auth";
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


export async function updateUserProfile(
  user: string,
  payload: UpdateUserProfilePayload,
) {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.bio !== undefined) {
    formData.append("bio", payload.bio);
  }

  if (payload.interests?.length) {
    payload.interests.forEach((interest) => {
      formData.append("interests", interest);
    });
  }

  if (payload.socileLinks?.length) {
    payload.socileLinks.forEach((links) => {
      formData.append("socialLinks", links);
    });
  }

  if (payload.profilePictureFile) {
    formData.append("profilePicture", payload.profilePictureFile);
    if (payload.profilePictureId) {
      formData.append("profilePictureId", payload.profilePictureId);
    }
  } else if (payload.profilePictureId !== undefined) {
    formData.append("profilePicture", payload.profilePictureId);
  }

  const { data } = await api.put(`/users/update/${user}`, formData, {
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
