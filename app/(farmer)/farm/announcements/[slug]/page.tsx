import DetailPage from "./_components/DetailPage";
import type { PageParams } from "@/types/next";

export default async function AnnouncementPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <DetailPage params={params} searchParams={searchParams} />;
}
