import type { ComponentPropsWithoutRef } from "react";
import { Typography } from "../../components/ui/typography";
import { cn } from "../../lib/utils";

export const Layout = (
  props: ComponentPropsWithoutRef<"div"> & {
    size?: "sm" | "default" | "lg" | "full";
  },
) => {
  return (
    <div
      {...props}
      className={cn(
        "flex-wrap w-full flex gap-4 m-auto",
        {
          "max-w-7xl px-4": props.size === "lg",
          "max-w-4xl px-4":
            props.size === "default" || (!props.size && props.size !== "full"),
          "max-w-3xl px-4": props.size === "sm",
          "max-w-none px-4 md:px-6": props.size === "full",
        },
        props.className,
      )}
    />
  );
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex items-start gap-2 flex-col w-full md:flex-1 min-w-[200px]",
        props.className,
      )}
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Typography {...props} variant="h2" className={cn(props.className)} />;
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"p">) => {
  return <Typography {...props} className={cn(props.className)} />;
};

export const LayoutActions = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div {...props} className={cn("flex items-center", props.className)} />
  );
};

export const LayoutContent = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("w-full", props.className)} />;
};
