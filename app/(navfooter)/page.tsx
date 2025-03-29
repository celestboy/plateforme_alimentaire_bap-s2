"use client";

import React, { useState } from "react";
// app/page.tsx
import getTotalCO2Stats from "@/actions/get-total-dons-co2";
import Image from "next/image";
import DisplayLastThree from "../_components/DisplayLastDons";
interface CO2Stats {
  totalWeightKg: number;
  totalCO2Saved: number;
  totalDonations: number;
}

export default function HomePage() {
  const [co2Stats, setCO2Stats] = useState<CO2Stats>({
    totalWeightKg: 0,
    totalCO2Saved: 0,
    totalDonations: 0,
  });

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getTotalCO2Stats();
        setCO2Stats(stats);
      } catch (error) {
        console.error("Error fetching CO2 stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <section className="hero bg-cover bg-center text-white h-[600px] w-full flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-justify w-full px-10">
          <h1 className="max-w-lg mx-auto text-2xl/[40px] md:text-5xl font-futuraPTBold text-center md:text-right md:absolute md:top-1/3 md:right-16 md:transform">
            La nouvelle initiative contre le gaspillage alimentaire &agrave;
            Rueil-Malmaison
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center w-full px-10 mt-10">
          <div className="w-full text-xs md:text-md md:w-1/2 flex justify-center">
            <div className="bg-white text-black rounded-lg p-5 w-80 font-futuraPTBold flex flex-col items-center">
              <p className="text-sm md:text-xl font-bold mb-4">
                Vous aussi, agissez contre le gaspillage
              </p>
              <div className="flex gap-4 font-futuraPTBold">
                <button className="bg-[#B0C482] text-white px-4 py-2 rounded hover:bg-gray-300">
                  En savoir plus
                </button>
                <button className="bg-[#B0C482] text-white px-4 py-2 rounded hover:bg-gray-300">
                  Commencer
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 text-2xl font-semibold text-justify hidden md:block"></div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center font-futuraPTBold">
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-[90%] md:w-[500px]">
            <i className="fas fa-map-marker-alt text-black text-lg mr-3"></i>
            <input
              type="text"
              placeholder="Adresse, Quartier..."
              className="flex-1 outline-none text-black text-xs md:text-lg"
            />
            <div className="h-5 w-px bg-gray-300 mx-1 md:mx-3"></div>
            <i className="fas fa-search text-black text-lg"></i>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-xl md:text-4xl font-bold m-12 font-futuraPTBold">
          Annonces pertinentes
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="inline-flex space-x-4 md:space-x-0 md:justify-center mx-auto">
            <DisplayLastThree />
          </div>
        </div>
      </section>

      <section className="font-futuraPTMedium relative mx-4 md:mx-16">
        <Image
          src="/images/sticker1.png"
          alt=""
          height="800"
          width="800"
          className="absolute w-16 top-[5%] md:w-44 rotate-[-20deg]"
        ></Image>

        <Image
          src="/images/sticker2.png"
          alt=""
          height="800"
          width="800"
          className="absolute w-16 md:w-56 top-[40%] md:left-[30%] rotate-[-20deg]"
        ></Image>

        <Image
          src="/images/sticker3.png"
          alt=""
          height="800"
          width="800"
          className="absolute w-24 md:w-56 top-[17%] md:top-[5%] left-[60%] rotate-[20deg]"
        ></Image>

        <Image
          src="/images/sticker4.png"
          alt=""
          height="800"
          width="800"
          className="absolute w-28 md:w-72 top-[50%] md:top-[35%] right-0 rotate-[10deg]"
        ></Image>

        <h3 className="text-2xl md:text-6xl text-center my-6 md:m-16">
          Dites non au{" "}
          <span className="text-[#084784] font-futuraPTBold">
            gaspillage alimentaire
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 md:m-8 lg:m-12 gap-4 md:gap-8 lg:gap-12">
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Liste facile des articles
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                R&eacute;pertoriez rapidement les articles alimentaires en
                surplus de votre garde-manger ou de votre r&eacute;frigerateur,
                pour que les autres membres de votre communaut&eacute; puissent
                voir ce qui est disponible.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Disponibilit&eacute; bas&eacute;e sur la localisation
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Trouvez des articles alimentaires pr&egrave;s de chez vous
                gr&acirc;ce &agrave; la recherche et aux filtres bas&eacute;s
                sur la localisation, ce qui rend l&apos;acc&egrave;s aux
                ressources alimentaires locales plus pratique.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Profils de donateurs v&eacute;rifi&eacute;s
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Consultez des profils v&eacute;rifi&eacute;s des personnes
                offrant des aliments, vous assurant ainsi de savoir &agrave; qui
                vous vous adressez pour des &eacute;changes s&ucirc;rs et
                fiables.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Mises &agrave; jour &agrave; temps r&eacute;el
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Recevez des notifications sur les nouveaux articles alimentaires
                disponibles et ceux qui approchent de leur date de
                p&eacute;remption, pour agir rapidement et &eacute;viter le
                gaspillage.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Engagement communautaire
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Engagez-vous avec d&apos;autres membres, partagez des conseils
                et rejoignez des initiatives communautiares pour r&eacute;duire
                le gaspillage alimentaire dans votre quartier.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Tableau de bord
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Suivez la quantit&eacute; de gaspillage alimentaire
                &eacute;vit&eacute;e et voyez votre contribution personnelle
                &agrave; la r&eacute;duction du gaspillage dans la
                communaut&eacute;.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl md:text-4xl text-center m-8 font-futuraPTBold">
          Localisation en temps r&eacute;el,{" "}
          <span className="text-[#084784]">avec de vraies personnes</span>
        </h3>

        <div className="m-4 md:m-16 md:flex">
          <Image
            src="/images/mairie.jpeg"
            alt=""
            width={1200}
            height={600}
            className="md:w-1/2 md:p-12"
          />

          <div className="flex flex-col justify-evenly text-lg font-futuraPTBold">
            <article className="m-6">
              <p className="text-[#084784]">
                R&eacute;pertorier facilement les aliments exc&eacute;dentaires
              </p>
              <p>
                Ajoutez rapidement des articles alimentaires
                exc&eacute;dentaires de votre cuisine, les rendant disponibles
                pour que les autres les trouvent et contribuent &agrave;
                r&eacute;duire le gaspillage.
              </p>
            </article>
            <article className="m-6">
              <p className="text-[#084784]">
                Partager des aliments en quelques minutes
              </p>
              <p>
                R&eacute;pertoriez et partagez des aliments exc&eacute;dentaires
                avec la communaut&eacute; en quelques clics, contribuant
                instantan&eacute;ment &agrave; la r&eacute;duction du
                gaspillage.
              </p>
            </article>
            <article className="m-6">
              <p className="text-[#084784]">Suivre votre impact</p>
              <p>
                Voyez combien de gaspillage alimentaire vous avez
                contribu&eacute; &agrave; pr&eacute;venir, cr&eacute;ant un
                impact positif dans votre communaut&eacute; et pour
                l&apos;environnement.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="md:flex justify-center items-center m-4 md:m-16">
        <article className="m-8 p-12 md:w-full text-center rounded-xl bg-slate-100">
          <h3 className="mb-6 font-futuraPTBold text-xl md:text-3xl">
            Nombre total de dons
          </h3>
          <p className="font-futuraPTMedium text-xl md:text-3xl">
            69{co2Stats.totalDonations}
          </p>
        </article>
        <article className="m-8 p-12 md:w-full text-center rounded-xl bg-slate-100">
          <h3 className="mb-6 font-futuraPTBold text-xl md:text-3xl">
            CO2 non gaspill&eacute;
          </h3>
          <p className="font-futuraPTMedium text-xl md:text-3xl">
            <span>36{co2Stats.totalCO2Saved} </span>Kg
          </p>
        </article>
      </section>
    </div>
  );
}
