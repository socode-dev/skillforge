import { lazy, useState } from "react";
import RequestNavBar from "./component/RequestNavBar";
import { AnimatePresence } from "framer-motion";
import LazyWrapper from "@/routes/LazyWrapper";
import { IncomingSkeleton, OutgoingSkeleton} from "@/components/skeletons/Requests";

const IncomingRequests = lazy(() => import("@/pages/skillRequests/component/IncomingRequests"));
const OutgoingRequests = lazy(() => import("@/pages/skillRequests/component/OutgoingRequests"));

const SkillRequests = () => {
  const [requestType, setRequestType] = useState<"incoming" | "outgoing">(
    "incoming"
  );

  return (
    <main className="mb-8 flex flex-col gap-15 px-6 md:px-8 lg:px-10">
      <RequestNavBar
        requestType={requestType}
        setRequestType={setRequestType}
      />

      <AnimatePresence mode="wait">
        {requestType === "incoming" ? (
          <LazyWrapper loadingFallback={<IncomingSkeleton type="incoming" />}><IncomingRequests /></LazyWrapper>
        ) : (
          <LazyWrapper loadingFallback={<OutgoingSkeleton type="outgoing" />}><OutgoingRequests /></LazyWrapper>
        )}
      </AnimatePresence>
    </main>
  );
};

export default SkillRequests;
