import AuthForm from "@/src/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <div className="[&_.auth-shell]:pt-[7.5rem] sm:[&_.auth-shell]:pt-[8rem] [&_.auth-shell-card]:max-w-[34rem] lg:[&_.auth-shell-book]:[transform:translate(1.5rem,-50%)] lg:[&_.auth-shell-pen]:[transform:translate(-0.75rem,-50%)]">
      <AuthForm mode="sign-up" />
    </div>
  );
}
