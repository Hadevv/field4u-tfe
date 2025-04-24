import fs from "fs";
import path from "path";

export const readMdxFile = (filePath: string): string => {
  const absolutePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`fichier non trouvé: ${filePath}`);
  }

  return fs.readFileSync(absolutePath, "utf8");
};

export const readContentFile = (fileName: string): string => {
  return readMdxFile(`content/${fileName}`);
};
