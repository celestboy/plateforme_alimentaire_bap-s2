"use client";

import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-[#b0c482] p-8">
      <div className="flex text-white font-futuraPTMedium text-xl p-12 justify-between">
        <section>
          <Image
            src="/images/logo-rueil.png"
            width={200}
            height={200}
            alt="logo"
          ></Image>
          <p className="my-8">
            13 Bd du Maréchal Foch, 92500 <br></br> Rueil-Malmaison
          </p>
          <p>+33 1 47 32 65 65</p>
        </section>
        <section className="flex items-end mb-24">
          <p>
            FoodShare 2025 <br></br> Contact <br></br> Mentions légales
            <br></br>
            Politique de confidentialité
          </p>
        </section>
        <section>
          <Image
            src="/images/patrick-ollier.png"
            width={200}
            height={200}
            alt="Maire de rueil malmaison"
            className="justify-self-end"
          ></Image>
          <p className="text-right mt-4">
            Patrick Ollier, maire de Rueil-Malmaison <br></br> depuis le 18 Juin
            2004
          </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
