import { User } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { outgoingRequestData } from "../data/requestsData";

const OutgoingRequestOverview = () => {
  return (
    <motion.div
      initial={{ x: 50, y: 20 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: -50, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {outgoingRequestData.map((data, i) => (
        <div
          key={data.id}
          className={clsx(
            "flex items-center gap-4 py-2 border-border",
            i + 1 !== outgoingRequestData.length && "border-b-1"
          )}
        >
          <div className="relative w-fit h-fit p-3 bg-soft-primary text-primary rounded-full">
            <User size={15} />
            {data.isActive && (
              <span className="w-2.5 h-2.5 absolute top-0.5 right-0 bg-primary rounded-full border-2 border-background"></span>
            )}
          </div>

          <div className="grow min-w-0 max-w-md">
            <h6 className="text-sm truncate">{data.name}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {data.skill}
            </p>
          </div>

          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {data.time}
          </p>
        </div>
      ))}
    </motion.div>
  );
};

export default OutgoingRequestOverview;
