import ParticulierBox from "./_components/ParticulierBox";
import CommercantBox from "./_components/CommercantBox";
import Link from "next/link";

export default function RegisterSchema() {
  return (
    <div className="text-center mt-4">
      <h3 className="text-4xl font-futuraPTBold">Page d&apos;inscription</h3>
      <div>
        <Link href="/connexion">
          <button type="button" className="mt-8 bg-[#084784] p-4 rounded-full text-white">Je me connecte</button>
        </Link>
      </div>
      <div className="flex justify-center items-center gap-10 mt-12">
        <ParticulierBox />
        <CommercantBox />
      </div>
    </div>
  );
}
