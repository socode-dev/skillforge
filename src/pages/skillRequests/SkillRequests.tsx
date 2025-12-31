import { useState } from "react";
import RequestNavBar from "./component/RequestNavBar";
import OutgoingRequests from "./component/OutgoingRequests";
import IncomingRequests from "./component/IncomingRequests";
import { AnimatePresence } from "framer-motion";

const SkillRequests = () => {
  const [requestType, setRequestType] = useState<"incoming" | "outgoing">(
    "incoming"
  );

  return (
    <main className="mb-8 flex flex-col gap-15">
      <RequestNavBar
        requestType={requestType}
        setRequestType={setRequestType}
      />

      <AnimatePresence mode="wait">
        {requestType === "incoming" ? (
          <IncomingRequests />
        ) : (
          <OutgoingRequests />
        )}
      </AnimatePresence>
    </main>
  );
};

export default SkillRequests;
