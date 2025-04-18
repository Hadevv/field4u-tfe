import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDateAndTime = (date: Date) => {
  return format(date, "MMMM d, yyyy 'at' h:mm aa");
};

export const formatDate = (date: Date) => {
  return format(date, "MMMM d, yyyy", { locale: fr });
};

export const getCurrentDate = () => new Date();

// fonction pour verifier si une date est dans le futur
export const isFutureDate = (date: Date | null | undefined): boolean => {
  if (!date) return false;
  const now = getCurrentDate();
  return date.getTime() > now.getTime();
};

// fonction pour verifier si une date est passe
export const isPastDate = (date: Date | null | undefined): boolean => {
  if (!date) return false;
  const now = getCurrentDate();
  return date.getTime() < now.getTime();
};

// fonction pour verifier si la date actuelle est entre deux dates
export const isDateBetween = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
): boolean => {
  if (!startDate || !endDate) return false;
  const now = getCurrentDate();
  return (
    startDate.getTime() <= now.getTime() && now.getTime() <= endDate.getTime()
  );
};
