// pnpm tsx scripts/unaccent-test.ts

import { prisma } from "@/lib/prisma";

async function testUnaccent() {
  const searchTerms = ["liege", "récolte", "recoltE", "glanage", "Glânage"];

  for (const term of searchTerms) {
    console.log(`Recherche par titre pour "${term}"`);
    try {
      // test avec unaccent
      const results = await prisma.$queryRaw`
        SELECT id, title
        FROM "announcements"
        WHERE unaccent(lower(title)) LIKE unaccent(lower(${`%${term}%`}))
        LIMIT 5;
      `;
      console.log(
        `Résultats avec unaccent (${Array.isArray(results) ? results.length : 0}):`,
      );
      console.log(results);

      // test avec la fonction mode: "insensitive"
      console.log(`Test avec mode "insensitive" sur le titre uniquement`);
      const insensitiveResults = await prisma.announcement.findMany({
        where: {
          title: { contains: term, mode: "insensitive" },
        },
        select: { id: true, title: true },
        take: 5,
      });
      console.log(`Résultats (${insensitiveResults.length}):`);
      console.log(insensitiveResults);

      // test de recherche par localisation
      if (term === "liege") {
        console.log(`Recherche par localisation pour "${term}"`);
        const locationResults = await prisma.$queryRaw`
          SELECT a.id, a.title, f.city
          FROM "announcements" a
          JOIN "fields" f ON a."field_id" = f.id
          WHERE unaccent(lower(f.city)) LIKE unaccent(lower(${`%${term}%`}))
             OR f."postal_code" LIKE ${`%${term}%`}
          LIMIT 5;
        `;
        console.log(
          `Résultats avec unaccent (${Array.isArray(locationResults) ? locationResults.length : 0}):`,
        );
        console.log(locationResults);
      }
    } catch (error) {
      console.error(`Erreur pour le terme "${term}"`, error);
    }
  }
}

testUnaccent();
