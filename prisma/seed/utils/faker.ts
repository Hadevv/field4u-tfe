import { Faker, fr_BE, fr } from "@faker-js/faker";

// crée une instance Faker localisée en français pour la Belgique
export const faker = new Faker({ locale: [fr_BE, fr] });

// générer de descriptions réalistes pour les champs
export const generateFieldDescription = () => {
  const size = faker.number.int({ min: 1, max: 20 });
  const terrain = faker.helpers.arrayElement([
    "plat",
    "légèrement vallonné",
    "en pente douce",
  ]);
  const exposition = faker.helpers.arrayElement([
    "bien exposé",
    "exposé plein sud",
    "partiellement ombragé",
  ]);
  return `Terrain ${terrain} de ${size} hectares, ${exposition}. ${faker.lorem.sentence()}`;
};

// générateur de titres d'annonces réalistes
export const generateAnnouncementTitle = (cropName: string) => {
  const actions = ["Glanage", "Récolte solidaire", "Cueillette"];
  const action = faker.helpers.arrayElement(actions);
  return `${action} de ${cropName} à ${faker.location.city()}`;
};

// générateur de descriptions d'annonces réalistes
export const generateAnnouncementDescription = (cropName: string) => {
  const quantity = faker.number.int({ min: 50, max: 500 });
  const quality = faker.helpers.arrayElement([
    "excellente",
    "bonne",
    "satisfaisante",
  ]);
  return `${quantity} kg de ${cropName} de ${quality} qualité disponibles pour le glanage. ${faker.lorem.sentence()}`;
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
  ]);
  const suffix = faker.string.numeric(6);
  return `${prefix}${suffix}`;
};

// générateur de codes postaux belges
export const generateBelgianPostalCode = () => {
  return faker.number.int({ min: 1000, max: 9999 }).toString();
};

// générateur de noms de fermes réalistes
export const generateFarmName = () => {
  const prefixes = ["Ferme", "Domaine", "Exploitation"];
  const adjectives = [
    "du Bonheur",
    "des Champs",
    "de la Vallée",
    "du Soleil",
    "des Quatre Saisons",
    "de Wallonie",
    "du Brabant",
  ];
  return `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(adjectives)}`;
};

// générateur de commentaires réalistes
export const generateComment = () => {
  const sentiments = [
    "Super expérience",
    "Très bonne organisation",
    "Accueil chaleureux",
    "Belle découverte",
    "Moment enrichissant",
  ];
  const details = [
    "Les agriculteurs sont très sympathiques",
    "Le lieu est facilement accessible",
    "Parfait pour une activité en famille",
    "On reviendra avec plaisir",
    "Merci pour cette opportunité",
  ];
  return `${faker.helpers.arrayElement(sentiments)}! ${faker.helpers.arrayElement(details)}.`;
};

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
  ];
}
export const generateCatchPhrase = () => {
  return `${faker.helpers.arrayElement(fr_BE.company?.adjective ?? [""])} et ${faker.helpers.arrayElement(fr_BE.company?.noun ?? [""])}`;
};
