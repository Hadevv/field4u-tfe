import { customAlphabet } from "nanoid";

export const formatId = (id: string) => {
  return id
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toLowerCase();
};

export const generateSlug = (value: string) => {
  const id = customAlphabet("1234567890abcdef", 10);
  let slug = value.toLowerCase();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.replace(/[^a-z0-9]+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "");
  slug = slug.substring(0, 50);
  return `${slug}-${id(6)}`;
};

export const getNameFromEmail = (email: string) => {
  return email.split("@")[0].split("+")[0];
};
