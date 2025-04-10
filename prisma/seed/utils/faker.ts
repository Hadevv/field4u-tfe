import { Faker, fr_BE, fr } from "@faker-js/faker";

// crée une instance Faker localisée en français pour la Belgique
export const faker = new Faker({ locale: [fr_BE, fr] });

// villes belges avec leurs codes postaux et coordonnées
export const belgianCities = [
  { city: "Bruxelles", postalCode: "1000", lat: 50.8503, lng: 4.3517 },
  { city: "Anvers", postalCode: "2000", lat: 51.2194, lng: 4.4025 },
  { city: "Gand", postalCode: "9000", lat: 51.0543, lng: 3.7174 },
  { city: "Charleroi", postalCode: "6000", lat: 50.4108, lng: 4.4446 },
  { city: "Liège", postalCode: "4000", lat: 50.6326, lng: 5.5797 },
  { city: "Bruges", postalCode: "8000", lat: 51.2093, lng: 3.2247 },
  { city: "Namur", postalCode: "5000", lat: 50.4673, lng: 4.8719 },
  { city: "Louvain", postalCode: "3000", lat: 50.8798, lng: 4.7005 },
  { city: "Mons", postalCode: "7000", lat: 50.4542, lng: 3.9523 },
  { city: "Wavre", postalCode: "1300", lat: 50.7167, lng: 4.6 },
  { city: "Arlon", postalCode: "6700", lat: 49.6851, lng: 5.8104 },
  { city: "Hasselt", postalCode: "3500", lat: 50.9308, lng: 5.3386 },
  { city: "Tournai", postalCode: "7500", lat: 50.6056, lng: 3.3886 },
  { city: "Verviers", postalCode: "4800", lat: 50.591, lng: 5.8659 },
  { city: "Dinant", postalCode: "5500", lat: 50.2608, lng: 4.9122 },
  { city: "Ottignies", postalCode: "1340", lat: 50.6697, lng: 4.5675 },
  { city: "La Louvière", postalCode: "7100", lat: 50.4795, lng: 4.1866 },
  { city: "Courtrai", postalCode: "8500", lat: 50.8285, lng: 3.2648 },
  { city: "Ostende", postalCode: "8400", lat: 51.2254, lng: 2.9087 },
  { city: "Genk", postalCode: "3600", lat: 50.9656, lng: 5.5068 },
  { city: "Alost", postalCode: "9300", lat: 50.9378, lng: 4.0451 },
  { city: "Nivelles", postalCode: "1400", lat: 50.5982, lng: 4.3254 },
  { city: "Ath", postalCode: "7800", lat: 50.6337, lng: 3.7775 },
  { city: "Hal", postalCode: "1500", lat: 50.7337, lng: 4.2356 },
  { city: "Tongres", postalCode: "3700", lat: 50.78, lng: 5.47 },
  { city: "Seraing", postalCode: "4100", lat: 50.5833, lng: 5.5 },
  { city: "Spa", postalCode: "4900", lat: 50.4926, lng: 5.8644 },
  { city: "Turnhout", postalCode: "2300", lat: 51.3225, lng: 4.9508 },
  { city: "Malines", postalCode: "2800", lat: 51.0259, lng: 4.4776 },
  { city: "Saint-Nicolas", postalCode: "9100", lat: 51.1719, lng: 4.1407 },
  { city: "Ypres", postalCode: "8900", lat: 50.8516, lng: 2.8861 },
  { city: "Ciney", postalCode: "5590", lat: 50.2945, lng: 5.097 },
  { city: "Gembloux", postalCode: "5030", lat: 50.56, lng: 4.69 },
  { city: "Visé", postalCode: "4600", lat: 50.7389, lng: 5.697 },
  { city: "Bastogne", postalCode: "6600", lat: 50.0017, lng: 5.7183 },
  { city: "Marche-en-Famenne", postalCode: "6900", lat: 50.2271, lng: 5.3434 },
  { city: "Rochefort", postalCode: "5580", lat: 50.1608, lng: 5.223 },
  { city: "Waremme", postalCode: "4300", lat: 50.695, lng: 5.2581 },
  { city: "Mouscron", postalCode: "7700", lat: 50.7445, lng: 3.2173 },
  { city: "Virton", postalCode: "6760", lat: 49.5671, lng: 5.5293 },
  { city: "Binche", postalCode: "7130", lat: 50.4125, lng: 4.1657 },
  { city: "Huy", postalCode: "4500", lat: 50.5189, lng: 5.2397 },
  { city: "Eupen", postalCode: "4700", lat: 50.63, lng: 6.03 },
  { city: "Neufchâteau", postalCode: "6840", lat: 49.8417, lng: 5.4356 },
  { city: "Saint-Vith", postalCode: "4780", lat: 50.28, lng: 6.12 },
  { city: "Chimay", postalCode: "6460", lat: 50.0481, lng: 4.317 },
  { city: "Beauraing", postalCode: "5570", lat: 50.1139, lng: 4.9553 },
  { city: "Malmedy", postalCode: "4960", lat: 50.4269, lng: 6.0269 },
  { city: "Durbuy", postalCode: "6940", lat: 50.3511, lng: 5.4563 },
  { city: "Braine-l'Alleud", postalCode: "1420", lat: 50.6837, lng: 4.3699 },
  { city: "Waterloo", postalCode: "1410", lat: 50.7147, lng: 4.3992 },
  { city: "Silly", postalCode: "7830", lat: 50.6494, lng: 3.9164 },
  { city: "Houffalize", postalCode: "6660", lat: 50.1419, lng: 5.7886 },
  { city: "Libramont", postalCode: "6800", lat: 49.92, lng: 5.38 },
  { city: "Philippeville", postalCode: "5600", lat: 50.1964, lng: 4.5456 },
  { city: "Couvin", postalCode: "5660", lat: 50.05, lng: 4.4833 },
  { city: "Thuin", postalCode: "6530", lat: 50.3384, lng: 4.2934 },
  { city: "Soignies", postalCode: "7060", lat: 50.5775, lng: 4.0719 },
  { city: "Coxyde", postalCode: "8670", lat: 51.1056, lng: 2.66 },
  { city: "Saint-Trond", postalCode: "3800", lat: 50.8167, lng: 5.1833 },
  { city: "Wezembeek-Oppem", postalCode: "1970", lat: 50.84, lng: 4.5 },
  { city: "Tervuren", postalCode: "3080", lat: 50.8225, lng: 4.5161 },
];

// prénoms belges courants
export const belgianFirstNames = [
  "Luc",
  "Marc",
  "Jean",
  "Pierre",
  "Michel",
  "Paul",
  "Thomas",
  "François",
  "David",
  "Julien",
  "Sophie",
  "Marie",
  "Anne",
  "Claire",
  "Julie",
  "Céline",
  "Isabelle",
  "Nathalie",
  "Valérie",
  "Catherine",
  "Ruben",
  "Jan",
  "Pieter",
  "Joris",
  "Koen",
  "Tom",
  "Wim",
  "Bart",
  "Stijn",
  "Maarten",
  "Emma",
  "Sofie",
  "Charlotte",
  "Eva",
  "Laura",
  "Sarah",
  "Lisa",
  "Eline",
  "Elise",
  "Lotte",
];

// noms de famille belges courants
export const belgianLastNames = [
  "Peeters",
  "Janssens",
  "Maes",
  "Jacobs",
  "Mertens",
  "Willems",
  "Claes",
  "Goossens",
  "Wouters",
  "De Smet",
  "Dubois",
  "Lambert",
  "Martin",
  "Simon",
  "Dupont",
  "Dumont",
  "Laurent",
  "Leroy",
  "Lejeune",
  "Renard",
  "Vandenberghe",
  "Verstraete",
  "Vermeulen",
  "Hermans",
  "De Vos",
  "Bogaert",
  "Deschamps",
  "Delcourt",
  "Legrand",
  "Leclercq",
];

// email et domaines belges
export const belgianDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.be",
  "telenet.be",
  "proximus.be",
  "voo.be",
  "skynet.be",
];

// générer un email belge réaliste
export const generateBelgianEmail = (firstName?: string, lastName?: string) => {
  const fName = firstName || faker.helpers.arrayElement(belgianFirstNames);
  const lName = lastName || faker.helpers.arrayElement(belgianLastNames);
  const domain = faker.helpers.arrayElement(belgianDomains);

  return faker.helpers.arrayElement([
    `${fName.toLowerCase()}.${lName.toLowerCase()}@${domain}`,
    `${fName.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}@${domain}`,
    `${lName.toLowerCase()}${fName.substring(0, 1).toLowerCase()}@${domain}`,
  ]);
};

// récupérer une ville belge aléatoire
export const getRandomBelgianCity = () => {
  return faker.helpers.arrayElement(belgianCities);
};

// générer de descriptions réalistes pour les champs
export const generateFieldDescription = () => {
  const size = faker.number.float({ min: 0.5, max: 20, fractionDigits: 1 });
  const terrain = faker.helpers.arrayElement([
    "plat",
    "légèrement vallonné",
    "en pente douce",
    "riche en limon",
    "argilo-calcaire",
  ]);
  const exposition = faker.helpers.arrayElement([
    "bien exposé",
    "exposé plein sud",
    "partiellement ombragé",
    "protégé du vent",
    "ensoleillé",
  ]);
  return `Terrain ${terrain} de ${size} hectares, ${exposition}. Idéal pour la culture de fruits et légumes.`;
};

// générateur de titres d'annonces réalistes
export const generateAnnouncementTitle = (cropName: string) => {
  const actions = [
    "Glanage",
    "Récolte solidaire",
    "Cueillette",
    "Ramassage participatif",
    "Récolte anti-gaspi",
  ];
  const city = getRandomBelgianCity().city;
  const action = faker.helpers.arrayElement(actions);
  return `${action} de ${cropName} à ${city}`;
};

// générateur de descriptions d'annonces réalistes
export const generateAnnouncementDescription = (cropName: string) => {
  const quantity = faker.number.int({ min: 50, max: 500 });
  const quality = faker.helpers.arrayElement([
    "excellente",
    "bonne",
    "satisfaisante",
    "bio",
    "non traitée",
  ]);
  const accessibility = faker.helpers.arrayElement([
    "Accès facile au champ.",
    "Prévoyez de bonnes chaussures.",
    "Terrain accessible en voiture.",
    "Prévoir une tenue adaptée.",
    "Parking à proximité.",
  ]);

  return `${quantity} kg de ${cropName} de ${quality} qualité disponibles pour le glanage. ${accessibility} Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.`;
};

// générateur de numéros de téléphone belges
export const generateBelgianPhoneNumber = () => {
  const prefix = faker.helpers.arrayElement([
    "0470",
    "0471",
    "0472",
    "0473",
    "0474",
    "0475",
    "0476",
    "0477",
    "0478",
    "0479",
    "0480",
    "0483",
    "0484",
    "0485",
    "0486",
    "0487",
    "0488",
    "0489",
    "02",
    "03",
    "04",
    "09",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "019",
  ]);

  const suffix =
    prefix.startsWith("0") && prefix.length === 2
      ? faker.string.numeric(7)
      : prefix.length === 3
        ? faker.string.numeric(6)
        : faker.string.numeric(6);

  return `${prefix}/${suffix.substring(0, 2)} ${suffix.substring(2, 4)} ${suffix.substring(4)}`;
};

// générateur de noms de fermes réalistes et belges
export const generateFarmName = () => {
  const prefixes = [
    "Ferme",
    "Domaine",
    "Exploitation",
    "Potager",
    "Verger",
    "Champs",
  ];
  const adjectives = [
    "du Bonheur",
    "des Champs",
    "de la Vallée",
    "du Soleil",
    "des Quatre Saisons",
    "de Wallonie",
    "du Brabant",
    "de Flandre",
    "des Ardennes",
    "de la Meuse",
    "de l'Escaut",
    "des Polders",
    "du Condroz",
    "Bio",
    "du Terroir",
    "Saint-Michel",
    "Notre-Dame",
    "de la Dyle",
    "de l'Ourthe",
    "du Hainaut",
    "de Hesbaye",
    "du Limbourg",
  ];
  const names = [
    ...belgianLastNames,
    "De Boer",
    "Van den Akker",
    "Le Jardinier",
    "De Pauw",
  ];

  return faker.helpers.arrayElement([
    `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(adjectives)}`,
    `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(names)}`,
    `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(names)}`,
  ]);
};

// générateur de commentaires réalistes
export const generateComment = () => {
  const sentiments = [
    "Super expérience",
    "Très bonne organisation",
    "Accueil chaleureux",
    "Belle découverte",
    "Moment enrichissant",
    "Magnifique échange",
    "Excellente initiative",
    "Activité très agréable",
  ];
  const details = [
    "Les agriculteurs sont très sympathiques",
    "Le lieu est facilement accessible",
    "Parfait pour une activité en famille",
    "On reviendra avec plaisir",
    "Merci pour cette opportunité",
    "J'ai appris beaucoup sur l'agriculture locale",
    "Une journée riche en découvertes",
    "C'est bon pour la planète et pour le moral",
  ];
  return `${faker.helpers.arrayElement(sentiments)}! ${faker.helpers.arrayElement(details)}. ${faker.helpers.arrayElement(
    [
      "Je recommande vivement.",
      "À refaire sans hésiter!",
      "Une belle façon de découvrir le métier d'agriculteur.",
      "Une belle expérience anti-gaspi.",
    ],
  )}`;
};

// liste de légumes et fruits belges avec leurs saisons
export const belgianCrops = [
  { name: "Pommes de terre", category: "VEGETABLE", season: "FALL" },
  { name: "Carottes", category: "VEGETABLE", season: "YEAR_ROUND" },
  { name: "Pommes", category: "FRUIT", season: "FALL" },
  { name: "Poires", category: "FRUIT", season: "FALL" },
  { name: "Tomates", category: "VEGETABLE", season: "SUMMER" },
  { name: "Courgettes", category: "VEGETABLE", season: "SUMMER" },
  { name: "Haricots verts", category: "VEGETABLE", season: "SUMMER" },
  { name: "Fraises", category: "FRUIT", season: "SUMMER" },
  { name: "Oignons", category: "VEGETABLE", season: "YEAR_ROUND" },
  { name: "Poireaux", category: "VEGETABLE", season: "WINTER" },
  { name: "Chicons", category: "VEGETABLE", season: "WINTER" },
  { name: "Endives", category: "VEGETABLE", season: "WINTER" },
  { name: "Choux de Bruxelles", category: "VEGETABLE", season: "WINTER" },
  { name: "Betteraves", category: "VEGETABLE", season: "FALL" },
  { name: "Céleris", category: "VEGETABLE", season: "FALL" },
  { name: "Navets", category: "VEGETABLE", season: "WINTER" },
  { name: "Épinards", category: "VEGETABLE", season: "SPRING" },
  { name: "Radis", category: "VEGETABLE", season: "SPRING" },
  { name: "Asperges", category: "VEGETABLE", season: "SPRING" },
  { name: "Rhubarbe", category: "FRUIT", season: "SPRING" },
  { name: "Cerises", category: "FRUIT", season: "SUMMER" },
  { name: "Framboises", category: "FRUIT", season: "SUMMER" },
  { name: "Groseilles", category: "FRUIT", season: "SUMMER" },
  { name: "Cassis", category: "FRUIT", season: "SUMMER" },
  { name: "Myrtilles", category: "FRUIT", season: "SUMMER" },
  { name: "Prunes", category: "FRUIT", season: "SUMMER" },
  { name: "Raisins", category: "FRUIT", season: "FALL" },
  { name: "Noix", category: "FRUIT", season: "FALL" },
  { name: "Courges", category: "VEGETABLE", season: "FALL" },
  { name: "Potirons", category: "VEGETABLE", season: "FALL" },
  { name: "Chicorée", category: "VEGETABLE", season: "WINTER" },
];

// ajout de termes spécifiques à la Belgique pour Faker
if (!fr_BE.company?.adjective) {
  fr_BE.company = fr_BE.company || {};
  fr_BE.company.adjective = [
    "innovante",
    "écologique",
    "familiale",
    "artisanale",
    "traditionnelle",
    "responsable",
    "performante",
    "réputée",
    "bio",
    "durable",
    "locale",
  ];
}

if (!fr_BE.company?.noun) {
  fr_BE.company.noun = [
    "exploitation",
    "ferme",
    "coopérative",
    "domaine",
    "plantation",
    "groupe agricole",
    "entreprise agricole",
    "verger",
    "potager",
    "maraîchage",
  ];
}

export const generateCatchPhrase = () => {
  const adjectives = [
    "Agriculture durable",
    "Production locale",
    "Culture respectueuse",
    "Exploitation familiale",
    "Tradition agricole",
    "Méthodes écologiques",
    "Terroir belge",
    "Savoir-faire ancestral",
  ];

  const values = [
    "depuis plus de 30 ans",
    "au service du goût",
    "respectueuse de l'environnement",
    "et produits de qualité",
    "pour des aliments savoureux",
    "en circuit court",
    "entre tradition et innovation",
    "au cœur de nos terroirs",
  ];

  return `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(values)}`;
};
