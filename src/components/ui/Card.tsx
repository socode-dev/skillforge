import { motion } from "framer-motion";
import clsx from "clsx";
import type { MotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <motion.div
      {...props}
      className={clsx(
        "w-full flex flex-col items-center gap-6 p-6 text-center bg-card rounded-radius shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
