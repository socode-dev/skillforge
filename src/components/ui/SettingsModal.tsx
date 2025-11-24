import { X } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SettingsModalProps {
  heading: string;
  children: ReactNode;
  onClose: () => void;
}

const SettingsModal = ({ children, heading, onClose }: SettingsModalProps) => {
  return (
    <AnimatePresence>
      {/* Dark overlay */}
      <div
        role="modal-overlay"
        className="fixed top-0 left-0 bottom-0 right-0 z-20 bg-black/20 "
      />

      <motion.main
        key={"settings-edit-modal"}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 bottom-0 left-0 right-0 md:left-6/12 lg:left-7/12 z-30 bg-background p-8 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h4>{heading}</h4>

          <button
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground transition rounded-radius cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </motion.main>
    </AnimatePresence>
  );
};

export default SettingsModal;
