import { AxiosError } from "axios";
import { loginUser, registerUser, verifyUserOtp } from "./auth-api";


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
    alert(response.message);
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
    alert(response.message);
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
  try {
    setLoading(true);
    return await loginUser(payload);
  } catch (error) {
    const message = getErrorMessage(error);
    alert(message);
    console.log(error);
    throw error;
  } finally {
    setLoading(false);
  }
}
