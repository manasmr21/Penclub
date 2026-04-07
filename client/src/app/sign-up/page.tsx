"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/src/components/auth/AuthForm";
import { useAppStore } from "@/src/lib/store/store";

export default function SignUpPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated && user) {
      router.replace("/");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return null;
  }

  if (user) {
    return null;
  }

  return (
    <div className="mt-32 mb-10">
      <AuthForm type="signup" />
    </div>
  );
}
