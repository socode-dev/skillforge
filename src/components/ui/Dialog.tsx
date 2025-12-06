import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface DialogProps {
  children: ReactNode;
  className?: string;
}

const Dialog = ({ children, className }: DialogProps) => {
  return (
    <AnimatePresence>
      {/* Dialog overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        role="modal-overlay"
        className="fixed top-0 left-0 bottom-0 right-0 z-20 bg-black/20 "
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        key={"Dialog overlay"}
        className={clsx(
          "fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] inset-0 z-30 p-6 h-fit w-[80%] max-w-[600px] flex flex-col bg-card text-card-foreground border-1 border-border rounded-radius-xl",
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Dialog;
