import { Outlet } from "react-router-dom";
import Header from "../components/layout/Landing/Header";
import Footer from "../components/layout/Landing/Footer";
import { ScrollToTop } from "./ScrollToTop";

const LandingPageLayout = () => {
  return (
    <div className="h-dvh relative flex flex-col">
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
