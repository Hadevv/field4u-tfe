import fs from "fs";
import path from "path";

export const readMdxFile = (filePath: string): string => {
  const rootPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(rootPath)) {
    return fs.readFileSync(rootPath, "utf8");
  }

  throw new Error(`Fichier non trouvé: ${filePath}`);
};

export const readContentFile = (fileName: string): string => {
  return readMdxFile(`content/${fileName}`);
};
