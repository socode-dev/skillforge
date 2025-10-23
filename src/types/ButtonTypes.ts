import type { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface ButtonProps
  extends ComponentPropsWithoutRef<typeof motion.button> {
  children: ReactNode | string;
  type: "submit" | "reset" | "button";
  onClick: () => void;
  variant:
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "destructive"
    | "ghost";
  isDisabled?: boolean;
  className?: string;
}

export interface Variants {
  primary: string;
  secondary: string;
  accent: string;
  outline: string;
  destructive: string;
  ghost: string;
}
