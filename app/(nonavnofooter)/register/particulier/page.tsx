import RegisterForm from "./_components/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export default function ParticulierFormPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex flex-col w-screen md:w-1/2 h-24 md:h-full bg-[#B0C482] md:rounded-r-3xl md:p-32 items-center justify-center">
          <Link href={"/register"}>
            <button
              type="button"
              className="absolute top-2 left-2 md:top-12 md:left-12 text-xs md:text-xl font-futuraPTMedium"
            >
              Retour
            </button>
          </Link>
          <Image
            className="absolute w-24 md:w-96 top-auto left-12 md:left-auto"
            src="/images/logo-sharefood.png"
            alt=""
            height="1200"
            width="1200"
          ></Image>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <h1 className="text-center font-futuraPTBold uppercase text-xl md:text-2xl my-8">
            Formulaire d&apos;inscription pour les Particuliers
          </h1>
          <div className="text-center">
            <RegisterForm />
            <Link href={"/connexion"}>
              <button type="button" className="m-4 text-xs md:text-lg">
                Déjà inscrit ? Se connecter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
