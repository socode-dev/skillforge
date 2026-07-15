import { Outlet } from "react-router-dom";
import Header from "../components/layout/Landing/Header";
import Footer from "../components/layout/Landing/Footer";
import { ScrollToTop } from "./ScrollToTop";
// import { Toaster } from "react-hot-toast";
import { Bounce, ToastContainer } from "react-toastify";
import AddSkill from "../components/dialogs/AddSkill";

const LandingPageLayout = () => {
  return (
    <div className="w-full min-h-dvh relative flex flex-col">
      {/* <Toaster /> */}
      <ToastContainer
        position="top-right"
        newestOnTop={true}
        pauseOnHover
        transition={Bounce}
        toastClassName={"toast"}
      />

      {/* Add skill dialog */}
      <AddSkill />

      <Header />
      <div className="grow bg-background text-foreground">
        <ScrollToTop />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
