import { Typography } from "@/components/ui/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { ServerMdx } from "@/features/markdown/ServerMdx";
import { readContentFile } from "@/features/markdown/markdown-utils";

const privacyContent = readContentFile("privacy-policy.mdx");

export default function page() {
  return (
    <div>
      <div className="flex w-full items-center justify-center bg-card p-8 lg:p-12">
        <Typography variant="h1">Politique de confidentialité</Typography>
      </div>
      <Layout>
        <LayoutContent className="m-auto mb-8 p-8 lg:p-12">
          <div className="[&_h1]:text-muted-foreground [&_h2]:text-muted-foreground [&_h3]:text-muted-foreground [&_h4]:text-muted-foreground [&_strong]:text-muted-foreground">
            <ServerMdx
              source={privacyContent}
              className="text-muted-foreground"
            />
          </div>
        </LayoutContent>
      </Layout>
    </div>
  );
}
