// CO2 emission per kg of food product (kg CO2 per kg of food)
export const productCO2 = {
	lentilles: 0.58,
	poireau: 0.61,
	pomme: 0.41,
	"pain type baguette": 0.78,
	"sucre blanc": 0.75,
	fromage: 6.69,
	poulet: 4.56,
	"jus de fruit": 1.01,
	"pomme de terre": 0.71,
	oignon: 0.42,
	poire: 0.39,
	pâte: 1.98,
	"café soluble": 1.53,
	beurre: 7.94,
	porc: 6.68,
	soda: 0.53,
	"patate douce": 0.33,
	ail: 0.38,
	clémentine: 1.3,
	"huile d'olive": 1.63,
	"café moulu": 8.54,
	lait: 1.27,
	bœuf: 29,
	"eau plate": 0.32,
	fèves: 0.86,
	carotte: 0.4,
	"pêche/nectarine": 0.6,
	vinaigre: 0.96,
	"chocolat au lait/noir": 15.85,
	yaourt: 1.89,
	charcuterie: 13.6,
	vin: 1.4,
	"haricots rouges": 0.86,
	courgette: 0.5,
	abricot: 1.45,
	poivre: 9.4,
	tofu: 1.56,
	saumon: 5.55,
	"poisson blanc": 12,
	quinoa: 5.85,
	concombre: 0.51,
	banane: 0.91,
	œuf: 1.88,
	miel: 1.57,
	compote: 1.1,
	"poisson gras": 2.45,
	"petits pois": 0.72,
	"chou-fleur": 0.72,
	framboise: 1.55,
	"sauce tomate": 1.46,
	muesli: 2.55,
	"crème dessert/mousse": 2.15,
	crevettes: 20.4,
	brocoli: 0.95,
	raisin: 0.51,
	moutarde: 1.59,
	"biscuit sec": 3.59,
	rillettes: 5.89,
	poivron: 0.72,
	mangue: 4.86,
	"pain de mie": 1.55,
	"extrait de vanille": 4.38,
	"fruits de mer": 5.33,
	radis: 0.38,
	citron: 0.76,
	"huile combinée": 2.5,
	dinde: 4.56,
	champignon: 6.17,
	kiwi: 1,
	asperge: 1.64,
	orange: 0.68,
	echalote: 0.39,
	melon: 0.98,
	"haricot vert": 0.45,
	pastèque: 0.68,
	avocat: 1.55,
	riz: 2.01,
	"farine de blé": 0.79,
	céréales: 3.4,
	"pâtes industrielles": 3.07,
	"poitrine de dinde": 4.56,
};

// Average CO2 emission per category (kg CO2 per kg of food)
export const categoryCO2 = {
	feculents: 1.5, // Average of pasta, rice, etc.
	viande: 10.0, // Average of meat products
	boisson: 0.8, // Average of drinks
	desserts: 2.5, // Average of desserts
	"produits-laiters": 4.0, // Average of dairy products
	autres: 2.0, // Default value
};

// Standard package sizes for different types of food (in kg)
export const standardPackageSizes = {
	// Féculents
	pâte: 0.5, // 500g package of pasta
	riz: 1.0, // 1kg package of rice
	"pain type baguette": 0.25, // 250g baguette
	"pain de mie": 0.5, // 500g sliced bread
	quinoa: 0.5, // 500g package
	céréales: 0.75, // 750g box of cereals
	lentilles: 0.5, // 500g package of lentils
	"haricots rouges": 0.5, // 500g package or can
	"farine de blé": 1.0, // 1kg bag of flour

	// Viande
	poulet: 1.0, // 1kg chicken
	porc: 0.5, // 500g pork
	bœuf: 0.5, // 500g beef
	dinde: 0.5, // 500g turkey
	"poitrine de dinde": 0.25, // 250g sliced turkey breast
	charcuterie: 0.2, // 200g package
	rillettes: 0.2, // 200g jar

	// Poisson
	saumon: 0.25, // 250g filet
	"poisson blanc": 0.4, // 400g package
	"poisson gras": 0.3, // 300g package
	crevettes: 0.25, // 250g package
	"fruits de mer": 0.3, // 300g package

	// Boissons
	"jus de fruit": 1.0, // 1L juice
	soda: 1.5, // 1.5L bottle
	"eau plate": 1.5, // 1.5L bottle
	vin: 0.75, // 750ml bottle
	lait: 1.0, // 1L carton

	// Légumes
	poireau: 0.5, // 500g bundle
	"pomme de terre": 1.0, // 1kg bag
	oignon: 1.0, // 1kg bag
	"patate douce": 0.8, // 800g
	ail: 0.1, // 100g (a few bulbs)
	carotte: 1.0, // 1kg bag
	courgette: 0.5, // 500g (about 2 medium)
	"chou-fleur": 0.8, // 800g head
	brocoli: 0.5, // 500g head
	poivron: 0.3, // 300g (about 2 medium)
	radis: 0.25, // 250g bunch
	echalote: 0.25, // 250g bag
	champignon: 0.25, // 250g package
	"petits pois": 0.4, // 400g package
	"haricot vert": 0.4, // 400g package
	concombre: 0.4, // 400g (1 large)
	tomate: 0.5, // 500g package

	// Fruits
	pomme: 1.0, // 1kg bag (about 6)
	poire: 1.0, // 1kg bag (about 5)
	banane: 1.0, // 1kg bunch (about 6)
	clémentine: 1.0, // 1kg bag/net
	"pêche/nectarine": 1.0, // 1kg (about 6-7)
	abricot: 0.5, // 500g (about 8)
	framboise: 0.25, // 250g box
	raisin: 0.5, // 500g bunch
	mangue: 0.4, // 400g (1 large)
	kiwi: 0.5, // 500g (about 4-5)
	asperge: 0.25, // 250g bunch
	orange: 1.0, // 1kg bag (about 4-5)
	melon: 1.2, // 1.2kg (1 melon)
	pastèque: 3.0, // 3kg (small watermelon)
	avocat: 0.3, // 300g (1 large)
	citron: 0.4, // 400g (about 3-4)

	// Produits laitiers
	fromage: 0.25, // 250g block
	beurre: 0.25, // 250g package
	yaourt: 1.0, // 1kg (pack of 4-8)
	"crème dessert/mousse": 0.5, // 500g (pack of 4)

	// Autres
	"sucre blanc": 1.0, // 1kg bag
	"café soluble": 0.2, // 200g jar
	"café moulu": 0.25, // 250g package
	miel: 0.25, // 250g jar
	compote: 0.5, // 500g jar or 4-pack
	vinaigre: 0.5, // 500ml bottle
	"huile d'olive": 0.75, // 750ml bottle
	"chocolat au lait/noir": 0.2, // 200g bar
	moutarde: 0.25, // 250g jar
	"sauce tomate": 0.4, // 400g jar/can
	"biscuit sec": 0.25, // 250g package
	œuf: 0.6, // 600g (dozen)
	tofu: 0.4, // 400g block
	muesli: 0.5, // 500g package
	poivre: 0.05, // 50g jar
	"extrait de vanille": 0.05, // 50ml bottle
	fèves: 0.5, // 500g package
};

// Default package sizes by category (in kg)
export const defaultPackageSizes = {
	feculents: 0.5, // 500g standard package
	viande: 0.5, // 500g standard package
	boisson: 1.0, // 1L standard bottle
	desserts: 0.5, // 500g standard package
	"produits-laiters": 0.5, // 500g standard package
	autres: 0.5, // 500g standard package
};

/**
 * Identifies a food product from title and description
 */
export function identifyFoodProduct(
	title: string,
	description: string
): string | null {
	const searchText = `${title.toLowerCase()} ${description.toLowerCase()}`;

	// Search for exact product matches
	for (const product of Object.keys(productCO2)) {
		if (searchText.includes(product)) {
			return product;
		}
	}

	// Search for partial matches or key words
	const keywords: Record<string, string> = {
		// Féculents
		pâtes: "pâte",
		spaghetti: "pâte",
		macaroni: "pâte",
		nouilles: "pâte",
		baguette: "pain type baguette",
		pain: "pain type baguette",

		// Viandes

		boeuf: "bœuf",
		beef: "bœuf",
		steak: "bœuf",
		jambon: "charcuterie",
		saucisson: "charcuterie",

		// Poissons
		cabillaud: "poisson blanc",
		merlu: "poisson blanc",
		colin: "poisson blanc",
		thon: "poisson gras",
		maquereau: "poisson gras",
		crevette: "crevettes",

		// Fruits
		pommes: "pomme",
		mandarine: "clémentine",
		mandarines: "clémentine",
		clementine: "clémentine",
		peche: "pêche/nectarine",
		pêche: "pêche/nectarine",
		nectarine: "pêche/nectarine",

		// Légumes
		// poireau, oignon, ail, carotte, courgette, chou-fleur, brocoli
		// poivron, radis, champignon, petits pois, haricot vert, concombre
		// are already exact matches
		choufleur: "chou-fleur",
		broccoli: "brocoli",
		champi: "champignon",
		"petit pois": "petits pois",
		"haricot verts": "haricot vert",
		"haricots verts": "haricot vert",
		patate: "pomme de terre",
		"pommes de terre": "pomme de terre",
		échalote: "echalote",
		échalotte: "echalote",

		// Produits laitiers
		yogourt: "yaourt",
		creme: "crème dessert/mousse",
		crème: "crème dessert/mousse",
		mousse: "crème dessert/mousse",

		// Boissons
		jus: "jus de fruit",
		coca: "soda",
		cola: "soda",
		eau: "eau plate",

		// Autres
		sucre: "sucre blanc",
		café: "café moulu",
		cafe: "café moulu",
		nescafé: "café soluble",
		huile: "huile combinée",
		"huile olive": "huile d'olive",
		chocolat: "chocolat au lait/noir",
		ketchup: "sauce tomate",
		biscuit: "biscuit sec",
		cookie: "biscuit sec",
		oeuf: "œuf",
		oeufs: "œuf",
		lentille: "lentilles",
		"haricot rouge": "haricots rouges",
	};

	for (const [keyword, product] of Object.entries(keywords)) {
		if (searchText.includes(keyword)) {
			return product;
		}
	}

	return null;
}

// Calculates the package weight based on the product and quantity

export function calculatePackageWeight(
	product: string | null,
	category: string,
	quantity: number
): number {
	// If we have a specific product and it's in our standard sizes
	if (product && product in standardPackageSizes) {
		return (
			quantity *
			standardPackageSizes[product as keyof typeof standardPackageSizes]
		);
	}

	// Otherwise, use category default
	const categoryWeight =
		defaultPackageSizes[category as keyof typeof defaultPackageSizes] ||
		defaultPackageSizes.autres;

	return quantity * categoryWeight;
}

// Calculates the CO2 saved by a food donation
export function calculateCO2Saved(
	title: string,
	description: string,
	category: string,
	quantity: number
): {
	weightKg: number;
	co2Saved: number;
	identifiedProduct: string | null;
} {
	// Try to identify the specific product
	const identifiedProduct = identifyFoodProduct(title, description);

	// Calculate weight based on product and quantity
	const weightKg = calculatePackageWeight(
		identifiedProduct,
		category,
		quantity
	);

	// Calculate the CO2 saved
	let co2Factor: number;

	if (identifiedProduct && identifiedProduct in productCO2) {
		// Use specific product CO2 value
		co2Factor = productCO2[identifiedProduct as keyof typeof productCO2];
	} else {
		// Use category average
		co2Factor =
			categoryCO2[category as keyof typeof categoryCO2] || categoryCO2.autres;
	}

	const co2Saved = weightKg * co2Factor;

	return {
		weightKg,
		co2Saved,
		identifiedProduct,
	};
}
