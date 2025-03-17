import Link from "next/link";
import RegisterForm from "./_components/RegisterForm";

export default function RegisterSchema() {
  return (
    <div>
      <h3>Page d&apos;inscription</h3>
      <div>
        <Link href="/connexion">
          <button type="button">Je me connecte</button>
        </Link>
      </div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
}
