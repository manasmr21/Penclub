import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import { login, register, type RegisterPayload } from "../../lib/auth";

export type AuthFormState = RegisterPayload & {
  identifier: string;
  profilePictureFile: File | null;
};

export const handleImageChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<any>>,
  setPreviewUrl: Dispatch<SetStateAction<string | null>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData((prev: any) => ({ ...prev, profilePictureFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
  }
};

export const handleSubmit = async (
  e: FormEvent<HTMLFormElement>,
  authType: 'login' | 'signup',
  formData: AuthFormState,
  setLoading: (value: boolean) => void,
  setUser: (user: any) => void,
  router: any
) => {
  e.preventDefault();

  try {
    if (authType === 'signup' && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (authType === 'signup') {
      await register(
        {
          ...formData,
          profilePictureFile: formData.profilePictureFile ?? undefined,
        },
        setLoading,
      );
      return;
    }

    const response = await login(
      {
        identifier: formData.identifier.trim(),
        password: formData.password,
      },
      setLoading,
    );

    if (response?.user) {
      setUser(response.user);
      router.push("/");
      router.refresh();
    }
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