import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Dashboard/Header";
import Sidebar from "@/components/layout/Dashboard/Sidebar";
import { useSidebarContext } from "@/context/useSidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Dashboard/Footer";
import ShowEditModal from "@/components/layout/Dashboard/ShowEditModal";
import ShowDialog from "@/components/layout/Dashboard/ShowDialog";
import { Bounce, ToastContainer } from "react-toastify";
import TabBar from "@/components/layout/Dashboard/TabBar";
import EditProfile from "@/components/dialogs/EditProfile";

const DashboardLayout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext();

  return (
    <div className="bg-background text-foreground flex w-full h-dvh relative">
      {/* <Toaster /> */}
      <ToastContainer
        position="top-right"
        newestOnTop={true}
        pauseOnHover
        transition={Bounce}
        toastClassName={"toast"}
      />

      {/* Settings edit modal */}
      <ShowEditModal />

      {/* Dialog */}
      <ShowDialog />

      <EditProfile />

      {/* Desktop Sidebar */}
      <aside
        aria-label="desktop sidebar"
        className="fixed w-1/6 h-full bg-background hidden border-r-1 border-border overflow-y-auto scrollbar-hide lg:flex flex-col"
      >
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <AnimatePresence>
          <div
            aria-label="sidebar overlay"
            role="button"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed top-0 left-0 right-0 bottom-0 inset-0 z-20 bg-black/20"
          />

          <motion.aside
            key={"mobile-sidebar"}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="mobile sidebar"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed h-full z-30 bg-background border-r-1 border-border w-68 overflow-y-auto scrollbar-hide flex flex-col"
          >
            <Sidebar />
          </motion.aside>
        </AnimatePresence>
      )}

      <div className=" w-full h-dvh lg:w-5/6 lg:left-1/6 absolute flex flex-col overflow-y-auto scrollbar-hide">
        <Header />
        <div className="grow pt-25 max-md:mb-15 bg-background text-foreground">
          <Outlet />
        </div>
        <Footer />
        <TabBar />
      </div>
    </div>
  );
};

export default DashboardLayout;
