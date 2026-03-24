import "./signup.css";
import AuthForm from "@/src/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <div className="signup-page">
      <AuthForm mode="sign-up" />
    </div>
  );
}
