import { UserRole, Language } from '@prisma/client';
import bcrypt from 'bcrypt';

const passwordHash = bcrypt.hashSync('password123', 10);

export const users = [
  {
    email: 'farmer.jean@example.be',
    name: 'Jean Dupont',
    role: UserRole.FARMER,
    language: Language.FRENCH,
    passwordHash,
    bio: 'Agriculteur bio depuis 20 ans dans la région de Namur',
  },
  {
    email: 'marie.gleaner@example.be',
    name: 'Marie Lambert',
    role: UserRole.GLEANER,
    language: Language.FRENCH,
    passwordHash,
    bio: 'Passionnée par la réduction du gaspillage alimentaire',
  },
  {
    email: 'admin@glean.be',
    name: 'Admin User',
    role: UserRole.ADMIN,
    language: Language.ENGLISH,
    passwordHash,
  },
  {
    email: 'farmer.pierre@example.be',
    name: 'Pierre Dubois',
    role: UserRole.FARMER,
    language: Language.FRENCH,
    passwordHash,
    bio: 'Ferme familiale depuis trois générations',
  },
  {
    email: 'sophie.gleaner@example.be',
    name: 'Sophie Van den Berg',
    role: UserRole.GLEANER,
    language: Language.DUTCH,
    passwordHash,
    bio: 'Engagée dans la lutte contre le gaspillage alimentaire',
  },
];