import clsx from "clsx";
import type { ButtonProps, Variants } from "../../types/ButtonTypes";
import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  onClick,
  variant,
  isDisabled = false,
  className,
  ...props
}: ButtonProps) => {
  const variants: Variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-dark focus:bg-primary-dark",
    secondary:
      "bg-secondary text-accent hover:bg-secondary-dark focus:bg-secondary-dark",
    accent:
      "bg-accent text-accent-foreground hover:bg-accent-dark focus:bg-accent-dark",
    outline:
      "bg-transparent border-border border-1 hover:text-primary hover:bg-accent",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive-dark focus:bg-destructive-dark",
    ghost: "bg-transparent text-foreground",
  };

  return (
    <motion.button
      {...props}
      type={type}
      onClick={onClick}
      className={clsx(
        "px-5 py-1.5 rounded-radius cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition",
        variants[variant],
        className
      )}
      disabled={isDisabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
