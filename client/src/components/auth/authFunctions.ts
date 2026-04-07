import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import { login, register, type RegisterPayload } from "../../lib/api";
import { type AuthUser } from "@/src/lib/store/store";

export type AuthFormState = RegisterPayload & {
  identifier: string;
  profilePictureFile?: File;
};

type RouterLike = {
  push: (href: string) => void;
  refresh: () => void;
};

export const handleImageChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<AuthFormState>>,
  setPreviewUrl: Dispatch<SetStateAction<string | null>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData((prev) => ({ ...prev, profilePictureFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
  }
};

const handleSignupSubmit = async (
  formData: AuthFormState,
  setLoading: (value: boolean) => void,
  router: RouterLike
) => {
  const response = await register(
    {
      ...formData,
      profilePictureFile: formData.profilePictureFile,
    },
    setLoading,
  ) as any;

  if (response?.user?.email) {
    const expiresAtQuery = response?.otpExpiresAt
      ? `&expiresAt=${encodeURIComponent(response.otpExpiresAt)}`
      : "";

    router.push(`/verify-otp?email=${encodeURIComponent(response.user.email)}${expiresAtQuery}`);
    router.refresh();
  }
};

const handleLoginSubmit = async (
  formData: AuthFormState,
  setLoading: (value: boolean) => void,
  setUser: (user: AuthUser | null) => void,
  router: RouterLike
) => {
  const response = await login(
    {
      identifier: formData.identifier.trim(),
      password: formData.password,
    },
    setLoading,
  ) as any;

  if (response?.user) {
    setUser(response.user);
    router.push("/");
    router.refresh();
  }
};

export const handleSubmit = async (
  e: FormEvent<HTMLFormElement>,
  authType: 'login' | 'signup',
  formData: AuthFormState,
  setLoading: (value: boolean) => void,
  setUser: (user: AuthUser | null) => void,
  router: RouterLike
) => {
  e.preventDefault();

  try {
    if (authType === 'signup' && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (authType === 'signup') {
      await handleSignupSubmit(formData, setLoading, router);
      return;
    }

    await handleLoginSubmit(formData, setLoading, setUser, router);
  } catch {
    // The auth helpers already surface the backend message to the user.
  }
};

export const handleInputChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<AuthFormState>>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};
