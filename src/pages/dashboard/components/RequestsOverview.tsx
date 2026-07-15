import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import IncomingRequestOverview from "./IncomingRequestOverview";
import OutgoingRequestOverview from "./OutgoingRequestOverview";
import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";

type RequestType = "incoming" | "outgoing";

const RequestsOverview = () => {
  const [requestType, setRequestType] = useState<RequestType>("incoming");

  return (
    <div className="bg-card text-card-foreground border-1 border-border rounded-radius-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h4>Skill Requests</h4>

        <Link
          to={"/home/skill-requests"}
          className="flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <span>View All</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="w-full space-y-6">
        <div className="w-full p-1 bg-muted rounded-full">
          <button
            onClick={() => setRequestType("incoming")}
            type="button"
            className={clsx(
              "w-1/2 text-sm font-semibold rounded-full p-1 text-center transition cursor-pointer",
              requestType === "incoming" && " bg-card"
            )}
          >
            Incoming
          </button>
          <button
            onClick={() => setRequestType("outgoing")}
            type="button"
            className={clsx(
              "w-1/2 text-sm font-semibold rounded-full p-1 text-center transition cursor-pointer",
              requestType === "outgoing" && "bg-card"
            )}
          >
            Outgoing
          </button>
        </div>

        <AnimatePresence mode="wait">
          {requestType === "incoming" ? (
            <IncomingRequestOverview />
          ) : (
            <OutgoingRequestOverview />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RequestsOverview;
