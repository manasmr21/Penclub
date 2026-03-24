export type UserRole = "author" | "reader";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
  penName?: string;
  username?: string;
  profilePicture?: string;
  phoneNumber?: string;
  interests?: string;
  bio?: string;
};

export type PendingOtpUser = AuthUser & {
  expiresAt: number;
  devOtp?: string;
};

const AUTH_USER_KEY = "penclub-auth-user";
const PENDING_OTP_KEY = "penclub-pending-otp";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("penclub-auth-change"));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event("penclub-auth-change"));
}

export function getPendingOtpUser(): PendingOtpUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PENDING_OTP_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingOtpUser;
  } catch {
    return null;
  }
}

export function setPendingOtpUser(user: PendingOtpUser) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_OTP_KEY, JSON.stringify(user));
}

export function clearPendingOtpUser() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_OTP_KEY);
}

export function formatTimeLeft(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
