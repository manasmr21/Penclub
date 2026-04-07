import { api, requestWithFallback } from "./http-client";

type LoginPayload = {
  identifier: string;
  password: string;
};

export async function registerUser(payload: FormData) {
  return requestWithFallback({
    axiosRequest: () => api.post("/users/create", payload),
    path: "/users/create",
    method: "POST",
    body: payload,
  });
}

export async function verifyUserOtp(email: string, otp: string) {
  return requestWithFallback({
    axiosRequest: () => api.post("/users/verify", { email, otp }),
    path: "/users/verify",
    method: "POST",
    body: { email, otp },
  });
}

export async function loginUser(payload: LoginPayload) {
  return requestWithFallback({
    axiosRequest: () => api.post("/users/login", payload),
    path: "/users/login",
    method: "POST",
    body: payload,
  });
}

export async function resendUserOtp(role: string, email: string) {
  void role;
  return requestWithFallback({
    axiosRequest: () => api.post("/users/resend", { email }),
    path: "/users/resend",
    method: "POST",
    body: { email },
  });
}

export async function updateUserProfile(
  user: string,
  payload: FormData,
) {
  return requestWithFallback({
    axiosRequest: () => api.put(`/users/update/${user}`, payload),
    path: `/users/update/${user}`,
    method: "PUT",
    body: payload,
  });
}

export async function logoutUser() {
  return requestWithFallback({
    axiosRequest: () => api.post("/users/logout"),
    path: "/users/logout",
    method: "POST",
  });
}

export async function deleteUserProfile(id: string, password: string){
  return requestWithFallback({
    axiosRequest: () => api.delete(`/users/delete/${id}`, { data: { password } }),
    path: `/users/delete/${id}`,
    method: "DELETE",
    body: { password },
  });
}

export async function forgotPassword(email: string){
  return requestWithFallback({
    axiosRequest: () => api.post("/users/forgot-password", { email }),
    path: "/users/forgot-password",
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(userId: string, token: string, newPassword: string){
  return requestWithFallback({
    axiosRequest: () =>
      api.post(`/users/reset-password?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`, {
        newPassword,
      }),
    path: `/users/reset-password?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
    method: "POST",
    body: { newPassword },
  });
}

export async function followAuthor(targetUserId: string) {
  return requestWithFallback({
    axiosRequest: () => api.post(`/users/follow/${targetUserId}`),
    path: `/users/follow/${targetUserId}`,
    method: "POST",
  });
}
