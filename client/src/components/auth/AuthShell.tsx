import Image from "next/image";
import { ReactNode } from "react";
import "./auth.css";

type AuthShellProps = {
  children: ReactNode;
  mode?: "sign-in" | "sign-up";
<<<<<<< HEAD
  maxWidthClassName?: string;
=======
  maxWidthClassName?: string
>>>>>>> 9d77c2bf63bc5447e73b4fc2f8f0e482b9f1955f
};

export default function AuthShell({
  children,
  mode = "sign-in",
}: AuthShellProps) {
  return (
    <main className="auth-shell">
      <div className="auth-shell-inner">
        <div className="auth-shell-book">
          <Image
            src="/images/bookicon.png"
            alt=""
            width={200}
            height={256}
            className="auth-shell-book-image"
            priority={false}
          />
        </div>

        <div className="auth-shell-pen">
          <Image
            src="/images/pen.png"
            alt=""
            width={152}
            height={240}
            className="auth-shell-pen-image"
            priority={false}
          />
        </div>

        <div className="auth-shell-card">
          <div
            className={`auth-shell-backdrop ${
              mode === "sign-up"
                ? "auth-shell-backdrop-sign-up"
                : "auth-shell-backdrop-sign-in"
            }`}
          />

          <section className="auth-shell-content">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
