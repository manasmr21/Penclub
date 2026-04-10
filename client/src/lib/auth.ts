import { loginUser, registerUser, verifyUserOtp, updateUserProfile, deleteUserProfile, forgotPassword, resetPassword } from "./auth-api";
import { type AuthUser } from "./store/store";
import { api, extractErrorMessage } from "./http-client";
export { api };

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
  profilePictureId?: string;
  profilePictureFile?: File;
  socialLinks?: string[];
  socileLinks?: string[];
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

    const socialLinks = payload.socialLinks ?? payload.socileLinks;
    if (socialLinks?.length) {
      socialLinks.forEach((link) => {
        formData.append("socialLinks", link);
      });
    }

    if (payload.profilePictureFile) {
      formData.append("profilePicture", payload.profilePictureFile);
      if (user.profilePictureId) {
        formData.append("profilePictureId", user.profilePictureId);
      }
    } else {
      const selectedProfilePicture = payload.profilePicture ?? payload.profilePictureId;
      if (selectedProfilePicture !== undefined) {
        formData.append("profilePicture", selectedProfilePicture);
      }
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

export async function update(user: string, payload: UpdateUserProfilePayload, setLoading: (value: boolean) => void) {
  return updateProfile(
    { id: user, profilePictureId: payload.profilePictureId },
    payload,
    setLoading
  );
}

export async function deleteUser(id: string, password: string, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
    const response = await deleteUserProfile(id, password);
    if (response.success) alert(response.message);
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(message);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function forgotPasswordAPi(email: string, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
    const response = await forgotPassword(email);
    if (response.success) alert(response.message);
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(message);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function resetUserPassword(userId: string, token: string, newPassword: string, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
    const response = await resetPassword(userId, token, newPassword);
    if (response.success) alert(response.message);
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(message);
    throw error;
  } finally {
    setLoading(false);
  }
}
