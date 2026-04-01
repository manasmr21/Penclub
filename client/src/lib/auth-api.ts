import { api } from "./api";
import { type RegisterPayload, type UserRole } from "./auth";


function rolePath(role: UserRole) {
  return role === "author" ? "authors" : "readers";
}

function appendTextField(formData: FormData, key: string, value?: string) {
  if (value) {
    formData.append(key, value);
  }
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const data = await api.post(`/users/create`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;

  } catch (error) {
    console.log(error)
  }
}


export async function verifyUserOtp(role: UserRole, email: string, otp: string) {
  const path = role === "author" ? "verify-otp" : "verify-email";
  const { data } = await api.post<AuthApiResponse>(`/${rolePath(role)}/${path}`, { email, otp });
  return data;
}

export async function resendUserOtp(role: UserRole, email: string) {
  if (role !== "author") {
    throw new Error("Resend OTP is not available for readers in the current server API.");
  }

  const { data } = await api.post<AuthApiResponse>(`/${rolePath(role)}/resend-otp`, { email });
  return data;
}

export async function updateUserProfile(
 user: AuthUser,
  payload: ReaderProfilePayload | AuthorProfilePayload,
) {
  if (!user.id || user.id === "undefined") {
    throw new Error("Profile session is invalid. Please sign in again.");
  }

  const hasProfileFile = payload.profilePictureFile instanceof File;

  if (user.role === "reader") {
     const readerPayload = {
      interest: payload.interests,
      profile: payload.bio,
      profilePicture: payload.profilePicture,
    };

    if (hasProfileFile) {
      const formData = new FormData();
      if (readerPayload.interest?.length) {
        readerPayload.interest.forEach((item) => formData.append("interest", item));
      }
      appendTextField(formData, "profile", readerPayload.profile);
      appendTextField(formData, "profilePicture", readerPayload.profilePicture);
      if (payload.profilePictureFile) {
        formData.append("profilePicture", payload.profilePictureFile);
      }

      const { data } = await api.put(`/${rolePath(user.role)}/update/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    }

    const { data } = await api.put(`/${rolePath(user.role)}/update/${user.id}`, readerPayload);
    return data;
  }

  if (hasProfileFile) {
    const formData = new FormData();
    if (payload.interests?.length) {
      payload.interests.forEach((item) => formData.append("interests", item));
    }
    appendTextField(formData, "bio", payload.bio);
    appendTextField(formData, "profilePicture", payload.profilePicture);
    if (payload.profilePictureFile) {
      formData.append("profilePicture", payload.profilePictureFile);
    }

    const { data } = await api.put(`/${rolePath(user.role)}/update/${user.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

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
