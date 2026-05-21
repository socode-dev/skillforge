import logo from "../../../assets/skillforge-logo.webp";
import { Menu, X } from "lucide-react";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import useMultiStepsStore from "../../../store/useMultiStepsStore";
import ThemeSelect from "../../ui/ThemeSelect";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentStep } = useMultiStepsStore();

  const hideHeader =
    pathname === "/login" ||
    pathname === "/signup/step-1" ||
    pathname === "/signup/step-2" ||
    pathname === "/signup/step-3" ||
    pathname === "/signup/step-4";

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener<"resize">("resize", handleResize);

    return () => window.removeEventListener<"resize">("resize", handleResize);
  }, [isMenuOpen]);

  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "fixed z-50 w-full bg-transparent backdrop-blur-2xl",
        hideHeader ? "hidden" : "block"
      )}
    >
      <div className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-18">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logo} alt="skillforge" loading="lazy" width={30} />
          <h1 className="text-md">SkillForge</h1>
        </button>

        <nav className="flex items-center gap-8 max-md:hidden">
          <a
            href="#home"
            className="w-fit hover:text-primary cursor-pointer transition"
          >
            Home
          </a>
          <a
            href="#process"
            className="w-fit hover:text-primary cursor-pointer transition"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="w-fit hover:text-primary cursor-pointer transition"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-5 max-md:hidden">
          <ThemeSelect />

          <Button
            onClick={() => navigate("/login")}
            type="button"
            variant="ghost"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate(`/signup/step-${currentStep}`)}
            type="button"
            variant="primary"
          >
            Sign Up
          </Button>
        </div>

        <Button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          variant="ghost"
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            role="button"
            initial={{ height: 0 }}
            animate={{ height: "fit-content" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="shadow-lg flex flex-col gap-8 w-full py-6 px-6 border-t-1 border-muted text-base overflow-y-scroll"
          >
            <nav className="flex flex-col gap-8">
              <a
                onClick={handleMenuClose}
                href="#home"
                className="w-fit hover:text-primary cursor-pointer transition"
              >
                Home
              </a>
              <a
                onClick={handleMenuClose}
                href="#process"
                className="w-fit hover:text-primary cursor-pointer transition"
              >
                How It Works
              </a>
              <a
                onClick={handleMenuClose}
                href="#features"
                className="w-fit hover:text-primary cursor-pointer transition"
              >
                Features
              </a>
            </nav>

            <div className="w-full flex justify-between items-center">
              <p>Theme</p>

              <ThemeSelect />
            </div>

            <div className="flex flex-col gap-8 w-full">
              <button
                onClick={() => {
                  navigate("/login");
                  handleMenuClose();
                }}
                className="w-fit text-foreground hover:text-primary transition cursor-pointer self-start"
              >
                Login
              </button>
              <Button
                onClick={() => {
                  navigate(`/signup/step-${currentStep}`);
                  handleMenuClose();
                }}
                type="button"
                variant="primary"
              >
                Sign Up
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
