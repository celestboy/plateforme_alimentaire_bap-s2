import LoginForm from "./_components/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-1/2 h-full bg-[#B0C482] rounded-r-3xl p-32 items-center justify-center">
        <Link href={"/register"}>
          <button
            type="button"
            className="absolute top-12 left-12 font-futuraPTMedium"
          >
            Retour
          </button>
        </Link>
        <Image
          src="/images/logo-sharefood.png"
          alt=""
          height="1200"
          width="1200"
        ></Image>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-center font-futuraPTBold uppercase text-2xl my-8">
          Connectez-vous à votre compte
        </h1>
        <div className="text-center">
          <LoginForm />
          <Link href={"/register"}>
            <button type="button" className="mt-4">
             Nouveau ici ? Créez un compte
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
