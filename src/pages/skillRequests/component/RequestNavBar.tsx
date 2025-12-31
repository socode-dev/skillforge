import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";

interface NavBarProps {
  requestType: "incoming" | "outgoing";
  setRequestType: Dispatch<SetStateAction<"incoming" | "outgoing">>;
}

const RequestNavBar = ({ requestType, setRequestType }: NavBarProps) => {
  return (
    <nav className="flex gap-2">
      <button
        onClick={() => setRequestType("incoming")}
        type="button"
        className={clsx(
          "py-2 px-4 rounded-full text-sm sm:text-base text-muted-foreground bg-card border-border border-1 cursor-pointer transition",
          requestType === "incoming" &&
            "bg-primary border-primary text-primary-foreground"
        )}
      >
        Incoming
      </button>

      <button
        onClick={() => setRequestType("outgoing")}
        type="button"
        className={clsx(
          "py-2 px-4 rounded-full text-sm sm:text-base text-muted-foreground bg-card border-border border-1 cursor-pointer transition",
          requestType === "outgoing" &&
            "bg-primary border-primary text-primary-foreground"
        )}
      >
        Outgoing
      </button>
    </nav>
  );
};

export default RequestNavBar;
