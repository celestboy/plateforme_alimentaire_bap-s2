import ParticulierBox from "./_components/ParticulierBox";
import CommercantBox from "./_components/CommercantBox";
import Link from "next/link";

export default function RegisterSchema() {
  return (
    <div>
      <h3>Page d&apos;inscription</h3>
      <div>
        <Link href="/connexion">
          <button type="button">Je me connecte</button>
        </Link>
      </div>
      <div className="flex justify-center items-center gap-10">
        <ParticulierBox />
        <CommercantBox />
      </div>
    </div>
  );
}
