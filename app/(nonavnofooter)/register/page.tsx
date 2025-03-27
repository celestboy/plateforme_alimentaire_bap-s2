import ParticulierBox from "./_components/ParticulierBox";
import CommercantBox from "./_components/CommercantBox";
import Link from "next/link";
import Image from "next/image";

export default function RegisterSchema() {
  return (
    <div className="flex text-center h-screen">
      <div className="flex flex-col w-screen h-full md:w-1/2 md:h-full bg-[#B0C482] md:rounded-r-3xl md:p-32 items-center justify-center">
        <Link href={"/"}>
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

      <div className="w-screen md:w-1/2 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-futuraPTBold uppercase ">
          Page d&apos;inscription
        </h3>
        <div>
          <Link href="/connexion">
            <button
              type="button"
              className="mt-8 bg-base-green px-6 py-3 rounded-full text-white font-futuraPTBook transition-colors hover:bg-dark-blue"
            >
              Je me connecte
            </button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-12">
          <ParticulierBox />
          <CommercantBox />
        </div>
      </div>
    </div>
  );
}
