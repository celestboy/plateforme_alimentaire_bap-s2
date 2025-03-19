"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
	{ name: "LOGO", href: "/" },
	{ name: "Accueil", href: "/x" },
	{ name: "Contact", href: "/y" },
	{ name: "Annonces", href: "/z" },
	{ name: "Je partage!", href: "/a" },
	{ name: "LOGIN", href: "/b" },
];

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	return (
		<div className="min-h-screen flex flex-col">
			<header className="fixed top-0 left-0 w-full bg-[#b0c482] flex justify-between items-center px-12 py-5 z-50">
				<a href="/">
					<div className="w-52">
						<img
							src="/images/logo-sharefood.png"
							alt="Logo Gaspillage Alimentaire"
							className="w-full h-auto"
						/>
					</div>
				</a>

				<nav>
					<ul className="flex space-x-12">
						<li>
							<a
								href="#"
								className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black">
								Accueil
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black">
								Contact
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black">
								Annonces
							</a>
						</li>
					</ul>
				</nav>

				<button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
					Créer un compte
				</button>
			</header>

			<main className="flex-grow">{children}</main>

			<footer className="flex bottom-0 w-full bg-[#b0c482] p-8">
				<p className="mx-auto text-white">
					© 2025 Gaspillage Alimentaire - Tous droits réservés
				</p>
			</footer>
		</div>
	);
}
