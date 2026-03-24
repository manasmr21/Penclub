import "./signin.css";
import AuthForm from "@/src/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <div className="signin-page">
      <AuthForm mode="sign-in" />
    </div>
  );
}
