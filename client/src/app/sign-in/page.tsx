import AuthForm from "@/src/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <div className="[&_.auth-shell]:pt-[5.75rem] sm:[&_.auth-shell]:pt-[6.5rem] [&_.auth-shell-card]:max-w-[30rem] lg:[&_.auth-shell-book]:[transform:translate(1.25rem,-50%)] lg:[&_.auth-shell-pen]:[transform:translate(-0.5rem,-50%)]">
      <AuthForm mode="sign-in" />
    </div>
  );
}
