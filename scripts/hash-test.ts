// pnpm tsx scripts/hash-test.ts

import bcrypt from "bcrypt";

const password = "password123";
const saltRounds = 10;

async function testHash() {
  // générer un hash
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("🔑 Hash généré:", hash);

  // comparer avec le mot de passe original
  const match = await bcrypt.compare(password, hash);
  console.log("✅ Le mot de passe est valide ?", match);
}

testHash();
