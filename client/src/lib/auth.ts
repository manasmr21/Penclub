import { loginUser, registerUser, verifyUserOtp, updateUserProfile } from "./auth-api";
import { type AuthUser } from "./store/store";
import { extractErrorMessage } from "./http-client";

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  profilePictureFile?: File;
}

export type LoginPayload = {
  identifier: string;
  password: string;
}

export type UpdateUserProfilePayload = {
  name?: string;
  interests?: string[];
  bio?: string;
  profilePicture?: string;
  profilePictureFile?: File;
};

function getErrorMessage(error: unknown) {
  return extractErrorMessage(error);
}
//new apis

export async function register(payload: RegisterPayload, setLoading: (value: boolean) => void) {
  try {

    setLoading(true);
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append('username', payload.username);
    formData.append("password", payload.password);
    formData.append("confirmPassword", payload.confirmPassword);
    formData.append("role", payload.role);
    if (payload.profilePictureFile) formData.append("profilePicture", payload.profilePictureFile);

    const response = await registerUser(formData);
    if (response.success) alert(response.message);
    return response;

  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function verifyOtp(email: string, otp: string, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
    const response = await verifyUserOtp(email, otp);
    if (response.success) alert(response.message);
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function login(payload: LoginPayload, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
    const response = await loginUser(payload);

    if (response.success) alert(response.message);
    return response
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function updateProfile(
  user: Pick<AuthUser, "id" | "profilePictureId">,
  payload: UpdateUserProfilePayload,
  setLoading?: (value: boolean) => void
) {
  try {
    if (setLoading) setLoading(true);
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

    const response = await updateUserProfile(user.id, formData);
    if (response?.success && response?.message) alert(response.message);
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}
