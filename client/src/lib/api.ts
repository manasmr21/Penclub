import axios from "axios";
import { AxiosError } from "axios";
import { loginUser, registerUser, verifyUserOtp, updateUserProfile, deleteUserProfile, forgotPassword, resetPassword } from "./auth-api";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  name: string;
  interests?: string[];
  bio?: string;
  profilePictureId?: string;
  profilePictureFile?: File;
  socileLinks?: string[]
};


function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
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

export async function update(user: string, payload: UpdateUserProfilePayload, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {
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

    const response = await updateUserProfile(user, formData);

    if (response.succes) alert("User updated successfully");
    return response;
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    setLoading(false)
  }

}

export async function deleteUser(id: string, password: string, setLoading: (value: boolean) => void) {
  setLoading(true);
  try {

    const response = await deleteUserProfile(`/users/delete/${id}`, password);

    if (response.success) alert(response.message);
    return response

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

    if(response.success) alert(response.message);
    return response

  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(message);
    throw error;
  } finally {
    setLoading(false);
  }

}

export async function resetUserPassword(userId: string, token:string, newPassword: string, setLoading: (value: boolean)=> void){
  setLoading(true);
  try {
    
    const response = await resetPassword(userId, token, newPassword);
    
    if(response.success) alert(response.message)
      
      return response
      
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
      console.log(message);
      throw error;
    }finally{
      setLoading(false);
    }
}