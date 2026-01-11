import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-sans font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium dark theme variants
        gold: "bg-gradient-gold text-background font-sans tracking-widest uppercase hover:shadow-gold-intense hover:scale-[1.02] transition-all duration-300",
        "gold-outline": "border border-pahlavi-gold/50 text-pahlavi-gold bg-transparent hover:bg-pahlavi-gold/10 hover:border-pahlavi-gold font-sans tracking-widest uppercase",
        "gold-ghost": "text-pahlavi-gold hover:text-pahlavi-gold-light hover:bg-pahlavi-gold/5 font-sans tracking-wide",
        hero: "bg-gradient-gold text-background font-sans tracking-[0.2em] uppercase text-sm px-10 py-6 hover:shadow-gold-intense hover:scale-[1.02] transition-all duration-500",
        "hero-outline": "border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5 hover:border-foreground/40 font-sans tracking-[0.2em] uppercase text-sm px-10 py-6 transition-all duration-500",
        minimal: "text-muted-foreground hover:text-foreground font-sans tracking-wide uppercase text-xs transition-colors",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8",
        xl: "h-14 px-12 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
