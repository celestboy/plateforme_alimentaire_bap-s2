import LoginForm from "./_components/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <h3>Page de login</h3>
      <div>
        <Link href="/register">
          <button type="button">Je m'inscris</button>
        </Link>
      </div>
      <div>
        <LoginForm />
      </div>
    </div>
  );
}
