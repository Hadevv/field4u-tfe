/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FieldTableContainer } from "@/features/admin/fields/FieldTableContainer";
import { isAdmin } from "@/lib/auth/helper";
import { Plus } from "lucide-react";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Gestion des champs | Field4u Admin",
  description: "Gérez les champs de la plateforme Field4u",
};

export default async function FieldsPage(props: PageParams<{}>) {
  await isAdmin();

  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  let whereClause: Prisma.FieldWhereInput = {};

  if (search) {
    whereClause = {
      OR: [
        { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
        { city: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
        {
          postalCode: {
            contains: search,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
      ],
    };
  }

  const totalFields = await prisma.field.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalFields / pageSize);

  const fields = await prisma.field.findMany({
    where: whereClause,
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      owner: true,
      farm: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ name: "asc" }],
  });

  const farms = await prisma.farm.findMany({
    orderBy: [{ name: "asc" }],
  });

  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>gestion des champs</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Suspense>
          <FieldTableContainer
            initialFields={fields}
            page={page}
            totalPages={totalPages}
            search={search}
            users={users}
            farms={farms}
            createButtonSlot={
              <Button
                variant="default"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="mr-2 size-4" />
                nouveau champ
              </Button>
            }
          />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}
