import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface SidebarContextState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextState | {}>({});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isSidebarOpen) setIsSidebarOpen(false);
    };

    window.addEventListener<"resize">("resize", handleResize);

    return () => window.removeEventListener<"resize">("resize", handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context || !("isSidebarOpen" in context)) {
    throw new Error("useSidebarContext must be used within a Provider");
  }
  return context;
};
