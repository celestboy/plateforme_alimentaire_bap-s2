"use client";

import React from "react";
// app/page.tsx

import Image from "next/image";
import ClientLayout from "./client-layout";
import DisplayLastThree from "./_components/DisplayLastDons";

export default function HomePage() {
  return (
    <ClientLayout>
      <div>
        <section className="hero bg-cover bg-center text-white h-[600px] w-full flex flex-col items-center justify-center">
          {/* Conteneur principal */}
          <div className="flex items-center justify-center w-full px-10">
            {/* Bloc de gauche avec CTA */}
            <div className="w-1/2 flex justify-center">
              <div className="bg-white text-black rounded-lg p-5 w-80 font-futuraPTBold">
                <p className="text-lg font-bold mb-4">
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

            {/* Bloc de droite avec le texte */}
            <div className="w-1/2 text-2xl font-semibold text-justify">
              <h1 className="max-w-lg mx-auto text-4xl/[50px] font-futuraPTBold">
                La nouvelle initiative contre le gaspillage alimentaire à
                Rueil-Malmaison
              </h1>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-20 flex flex-col justify-center font-futuraPTBold">
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-[500px]">
              <i className="fas fa-map-marker-alt text-black text-lg mr-3"></i>
              <input
                type="text"
                placeholder="Adresse, Quartier..."
                className="flex-1 outline-none text-black text-lg"
              />
              <div className="h-5 w-px bg-gray-300 mx-3"></div>
              <i className="fas fa-search text-black text-lg"></i>
            </div>
            <p className="ml-4">
              Cherchez des annonces selon votre localisation
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold m-12 font-futuraPTBold">
            Annonces pertinentes
          </h2>
          <div className="flex justify-center">
            <DisplayLastThree />
          </div>
        </section>

        <section className="font-futuraPTMedium relative mx-16">
          <Image
            src="/images/sticker1.png"
            alt=""
            height="800"
            width="800"
            className="absolute w-44 rotate-[-20deg]"
          ></Image>

          <Image
            src="/images/sticker2.png"
            alt=""
            height="800"
            width="800"
            className="absolute w-56 top-[40%] left-[30%] rotate-[-20deg]"
          ></Image>

          <Image
            src="/images/sticker3.png"
            alt=""
            height="800"
            width="800"
            className="absolute left-[60%] w-56 rotate-[20deg]"
          ></Image>

          <Image
            src="/images/sticker4.png"
            alt=""
            height="800"
            width="800"
            className="absolute w-72 top-[35%] right-0 rotate-[10deg]"
          ></Image>

          <h3 className="text-4xl text-center m-8">
            Dites non au{" "}
            <span className="text-[#084784]">gaspillage alimentaire</span>
          </h3>

          <div className="flex flex-wrap gap-5 m-12">
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Liste facile des articles
              </p>
              <p>
                Repertoriez rapidement les articles alimentaires en surplus de
                votre garde-manger ou de votre refrigerateur, pour que les
                autres membres de votre communaute puissent voir ce qui est
                disponible.
              </p>
            </article>
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Disponibilite basee sur la localisation
              </p>
              <p>
                Trouvez des articles alimentaires pres de chez vous grace a la
                recherche et aux filtres bases sur la localisation, ce qui rend
                l’acces aux ressources alimentaires locales plus pratique.
              </p>
            </article>
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Profils de donateurs verifies
              </p>
              <p>
                Consultez des profils verifies des personnes offrant des
                aliments, vous assurant ainsi de savoir a qui vous vous adressez
                pour des echanges surs et fiables.
              </p>
            </article>
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Mises a jour a temps reel
              </p>
              <p>
                Recevez des notifications sur les nouveaux articles alimentaires
                disponibles et ceux qui approchent de leur date de peremption,
                pour agir rapidement et eviter le gaspillage.
              </p>
            </article>
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Engagement communautaire
              </p>
              <p>
                Engagez-vous avec d’autres membres, partagez des conseils et
                rejoignez des initiatives communautiares pour reduire le
                gaspillage alimentaire dans votre quartier.
              </p>
            </article>
            <article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center border-[#B0C482] border-2 rounded-[50px] box-border">
              <p className="text-[#B0C482] text-lg mb-2 font-futuraPTBold">
                Tableau de bord
              </p>
              <p>
                Suivez la quantite de gaspillage alimentaire evitee et voyez
                votre contribution personnelle a la reduction du gaspillage dans
                la communaute.
              </p>
            </article>
          </div>
        </section>

        <section>
          <h3 className="text-4xl text-center m-8 font-futuraPTBold">
            Localisation en temps réel,{" "}
            <span className="text-[#084784]">avec de vraies personnes</span>
          </h3>

          <div className="m-16 flex">
            <Image
              src="/images/mairie.jpeg"
              alt=""
              width={1200}
              height={600}
              className="w-1/2 p-12"
            />

            <div className="flex flex-col justify-evenly text-lg font-futuraPTBold">
              <article>
                <p className="text-[#084784]">
                  Repertorier facilement les aliments excedentaires
                </p>
                <p>
                  Ajoutez rapidement des articles alimentaires excedentaires de
                  votre cuisine, les rendant disponibles pour que les autres les
                  trouvent et contribuent a reduire le gaspillage.
                </p>
              </article>
              <article>
                <p className="text-[#084784]">
                  Partager des aliments en quelques minutes
                </p>
                <p>
                  Repertoriez et partagez des aliments excedentaires avec la
                  communaute en quelques clics, contribuant instantanement a la
                  reduction du gaspillage.
                </p>
              </article>
              <article>
                <p className="text-[#084784]">Suivre votre impact</p>
                <p>
                  Voyez combien de gaspillage alimentaire vous avez contribue a
                  prevenir, creant un impact positif dans votre communaute et
                  pour l&apos;environnement.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}
