import { ErrorBoundary } from "@/components/utils/ErrorBoundaries";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { rehypePlugins, remarkPlugins } from "./markdown.config";

export type ClientMarkdownProps = ComponentPropsWithoutRef<typeof Markdown>;

export const ClientMarkdown = ({
  children,
  className,
  ...props
}: ClientMarkdownProps) => {
  return (
    <ErrorBoundary>
      <Markdown
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins}
        className={cn(
          "prose dark:prose-invert text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Markdown>
    </ErrorBoundary>
  );
};
