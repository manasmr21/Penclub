import { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  maxWidthClassName?: string;
  backgroundSize?: string;
};

export default function AuthShell({
  children,
  maxWidthClassName = "max-w-lg",
  backgroundSize = "66%",
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff8cf,_#faf8e3_52%,_#efe7b8)] px-5 py-3 md:px-8 md:py-6">
      <div
        className={`relative mx-auto w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(13,56,125,0.12)] backdrop-blur ${maxWidthClassName}`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url('/images/pensignup.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize,
          }}
        />

        <section className="relative z-10 px-4 py-1 md:px-4 md:py-1">
          {children}
        </section>
      </div>
    </main>
  );
}
