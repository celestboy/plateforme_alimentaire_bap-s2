import RegisterForm from "./_components/RegisterForm";
import Link from "next/link";

export default function CommercantFormPage() {
  return (
    <>
      <div>
        <h1 className="text-center font-futuraPTHeavy uppercase text-2xl my-4">
          Formulaire d&apos;inscription pour les Commerçants
        </h1>
        <div className="flex flex-col gap-4 items-center mb-6">
          <Link href={"/connexion"}>
            <button type="button">Je souhaite me connecter</button>
          </Link>
          <Link href={"/register"}>
            <button type="button">Revenir à la page précédente</button>
          </Link>
        </div>
      </div>
      <div>
        <RegisterForm />
      </div>
    </>
  );
}
