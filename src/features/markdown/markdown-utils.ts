import fs from "fs";
import path from "path";

export const readMdxFile = (filePath: string): string => {
  // essayer d'abord dans le dossier content à la racine (dev)
  const rootPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(rootPath)) {
    return fs.readFileSync(rootPath, "utf8");
  }

  // sinon essayer dans public/content (prod)
  const publicPath = path.join(process.cwd(), "public", filePath);

  if (fs.existsSync(publicPath)) {
    return fs.readFileSync(publicPath, "utf8");
  }

  throw new Error(`fichier non trouvé: ${filePath}`);
};

export const readContentFile = (fileName: string): string => {
  return readMdxFile(`content/${fileName}`);
};
