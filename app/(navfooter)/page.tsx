"use client";

import React from "react";
// app/page.tsx

import Image from "next/image";
import DisplayLastThree from "../_components/DisplayLastDons";

export default function HomePage() {
	return (
    <div>
      <section className="hero bg-cover bg-center text-white h-[600px] w-full flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-justify w-full px-10">
          <h1 className="max-w-lg mx-auto text-2xl/[40px] md:text-4xl font-futuraPTBold text-center md:text-right md:absolute md:top-1/2 md:right-10 md:transform md:-translate-y-1/2">
            La nouvelle initiative contre le gaspillage alimentaire à
            Rueil-Malmaison
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center w-full px-10 mt-10">
          <div className="w-full text-xs md:text-md md:w-1/2 flex justify-center">
            <div className="bg-white text-black rounded-lg p-5 w-80 font-futuraPTBold">
              <p className="text-sm md:text-xl font-bold mb-4">
                Vous aussi, agissez contre le gaspillage
              </p>
              <div className="flex gap-4 font-futuraPTBold">
                <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-gray-300">
                  En savoir plus
                </button>
                <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-gray-300">
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
          <p className="ml-4 mt-2 text-xs md:text-lg">
            Cherchez des annonces selon votre localisation
          </p>
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
                Repertoriez rapidement les articles alimentaires en surplus de
                votre garde-manger ou de votre refrigerateur, pour que les
                autres membres de votre communaute puissent voir ce qui est
                disponible.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Disponibilite basee sur la localisation
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Trouvez des articles alimentaires pres de chez vous grace a la
                recherche et aux filtres bases sur la localisation, ce qui rend
                l&apos;acces aux ressources alimentaires locales plus pratique.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Profils de donateurs verifies
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Consultez des profils verifies des personnes offrant des
                aliments, vous assurant ainsi de savoir a qui vous vous adressez
                pour des echanges surs et fiables.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Mises a jour a temps reel
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Recevez des notifications sur les nouveaux articles alimentaires
                disponibles et ceux qui approchent de leur date de peremption,
                pour agir rapidement et eviter le gaspillage.
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
                et rejoignez des initiatives communautiares pour reduire le
                gaspillage alimentaire dans votre quartier.
              </p>
            </article>
          </div>
          <div className="aspect-square">
            <article className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8 text-center border-[#B0C482] border-2 rounded-[30px] md:rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg sm:text-xl lg:text-xl 2xl:text-2xl mb-2 font-futuraPTBold">
                Tableau de bord
              </p>
              <p className="text-sm sm:text-base lg:text-base 2xl:text-lg">
                Suivez la quantite de gaspillage alimentaire evitee et voyez
                votre contribution personnelle a la reduction du gaspillage dans
                la communaute.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl md:text-4xl text-center m-8 font-futuraPTBold">
          Localisation en temps réel,{" "}
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
                Repertorier facilement les aliments excedentaires
              </p>
              <p>
                Ajoutez rapidement des articles alimentaires excedentaires de
                votre cuisine, les rendant disponibles pour que les autres les
                trouvent et contribuent a reduire le gaspillage.
              </p>
            </article>
            <article className="m-6">
              <p className="text-[#084784]">
                Partager des aliments en quelques minutes
              </p>
              <p>
                Repertoriez et partagez des aliments excedentaires avec la
                communaute en quelques clics, contribuant instantanement a la
                reduction du gaspillage.
              </p>
            </article>
            <article className="m-6">
              <p className="text-[#084784]">Suivre votre impact</p>
              <p>
                Voyez combien de gaspillage alimentaire vous avez contribue a
                prevenir, creant un impact positif dans votre communaute et pour
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
          <p className="font-futuraPTMedium text-xl md:text-3xl">999</p>
        </article>
        <article className="m-8 p-12 md:w-full text-center rounded-xl bg-slate-100">
          <h3 className="mb-6 font-futuraPTBold text-xl md:text-3xl">CO2 évité</h3>
          <p className="font-futuraPTMedium text-xl md:text-3xl">
            <span>999 </span>Kg
          </p>
        </article>
      </section>
    </div>
  );
}
