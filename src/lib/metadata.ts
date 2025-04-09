import type { PageParams } from "@/types/next";
import type { Metadata, ResolvingMetadata } from "next";

export const combineWithParentMetadata =
  (metadata: Metadata) =>
  async (_: PageParams, parent: ResolvingMetadata): Promise<Metadata> => {
    const parentMetadata = await parent;
    return {
      ...metadata,
      title: `${parentMetadata.title?.absolute} · ${metadata.title}`,
    };
  };
