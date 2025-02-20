-- Contraintes CHECK
ALTER TABLE "reviews" 
  ADD CONSTRAINT rating_range 
  CHECK (rating BETWEEN 1 AND 5);

ALTER TABLE "announcements" 
  ADD CONSTRAINT quantity_non_negative 
  CHECK (quantity_available >= 0);

ALTER TABLE "gleaning_periods" 
  ADD CONSTRAINT valid_date_range 
  CHECK (start_date < end_date);

ALTER TABLE "fields" 
  ADD CONSTRAINT ownership_check 
  CHECK (
    (farm_id IS NOT NULL AND owner_id IS NULL) 
    OR 
    (farm_id IS NULL AND owner_id IS NOT NULL)
  );