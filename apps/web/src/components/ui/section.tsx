import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      hero: "relative",
      content: "py-16",
      feature: "py-12",
      contact: "py-8",
    },
    background: {
      default: "",
      white: "bg-white",
      gray: "bg-gray-50",
      dark: "bg-gray-900",
      primary: "bg-primary-50",
      gradient: "bg-gradient-to-r from-primary-600 to-primary-800",
    },
    spacing: {
      none: "py-0",
      sm: "py-4",
      md: "py-8",
      lg: "py-12",
      xl: "py-16",
      "2xl": "py-20",
    },
  },
  defaultVariants: {
    variant: "default",
    background: "default",
    spacing: "lg",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  asChild?: boolean;
  as?: "section" | "div" | "article" | "main" | "aside" | "header" | "footer";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, background, spacing, asChild = false, as = "section", ...props }, ref) => {
    const Comp = asChild ? Slot : as;
    return (
      <Comp
        className={cn(sectionVariants({ variant, background, spacing, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export { Section, sectionVariants };
