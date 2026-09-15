import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "elevated" | "outlined" | "glass";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface-container-lowest border border-outline-variant/30",
  elevated: "bg-surface-container-lowest shadow-md",
  outlined: "bg-transparent border-2 border-outline-variant",
  glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "default", interactive = false, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl",
        variantClasses[variant],
        interactive && "transition-all duration-200 ease-out-expo hover:shadow-lg active:scale-[0.99] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-6 pt-4", className)} {...props}>
      {children}
    </div>
  );
}
