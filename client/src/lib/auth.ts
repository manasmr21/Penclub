import {registerUser} from "./auth-api";

export type UserRole = "reader" | "author";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePictureFile?: File;
}
//new apis

export async function register(payload: RegisterPayload) {
  try {

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("role", payload.role);
    if (payload.profilePictureFile) formData.append("profilePicture", payload.profilePictureFile);

    // @ts-expect-error
    const response = await registerUser(formData);

    return response;

  } catch (error) {
    console.log(error);
  }
}