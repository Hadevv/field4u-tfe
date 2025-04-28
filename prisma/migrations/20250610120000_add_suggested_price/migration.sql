-- Ajouter le champ suggested_price à la table announcements
ALTER TABLE "announcements" 
ADD COLUMN "suggested_price" DECIMAL(10,2); 