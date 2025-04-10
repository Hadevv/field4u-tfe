/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/lib/auth/helper";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();

      if (!user) {
        throw new UploadThingError("Authentification requise");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé pour l'utilisateur:", metadata.userId);
      console.log("URL du fichier:", file.ufsUrl);

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  multiImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 8,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user) {
        throw new UploadThingError("Authentification requise");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
