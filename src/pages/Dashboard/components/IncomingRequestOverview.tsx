import { Check, User, X } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { incomingRequestData } from "../data/requestsData";

const IncomingRequestOverview = () => {
  return (
    <motion.div
      initial={{ x: -50, y: 20 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: 50, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {incomingRequestData.map((data, index) => (
        <div
          key={data.id}
          className={clsx(
            "flex items-center gap-4 py-2 border-border",
            index + 1 !== incomingRequestData.length && "border-b-1"
          )}
        >
          <div className="relative w-fit h-fit p-3 bg-soft-primary text-primary rounded-full">
            <User size={17} />
            {data.isActive && (
              <span className="w-2.5 h-2.5 absolute top-0.5 right-0 bg-primary rounded-full border-2 border-background"></span>
            )}
          </div>

          <div className="grow max-w-md min-w-0">
            <h6 className="text-sm truncate">{data.name}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {data.skill}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {data.time}
            </p>

            <button
              type="button"
              onClick={() => console.log("")}
              className="p-2 bg-primary text-primary-foreground rounded-radius"
            >
              <Check size={15} />
            </button>
            <button
              type="button"
              onClick={() => console.log("")}
              className="p-2 border-border border-1 rounded-radius text-destructive"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default IncomingRequestOverview;
