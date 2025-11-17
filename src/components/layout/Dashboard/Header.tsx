import { Bell, Menu, User } from "lucide-react";
import { useSidebarContext } from "../../../context/useSidebarContext";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { setIsSidebarOpen } = useSidebarContext();
  const newNotification = true;
  const { pathname } = useLocation();

  let dashboardName;

  switch (true) {
    case pathname === "/home":
      dashboardName = "Dashboard Overview";
      break;
    case pathname.includes("discover"):
      dashboardName = "Discover";
      break;
    case pathname.includes("skill-requests"):
      dashboardName = "Skill Requests";
      break;
    case pathname.includes("messages"):
      dashboardName = "Messages";
      break;
    case pathname.includes("profile"):
      dashboardName = "Profile";
      break;
    case pathname.includes("settings"):
      dashboardName = "Settings";
      break;
    default:
      dashboardName = "Dashboard Overview";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background lg:left-1/6 py-4 px-6 md:px-8 flex items-center gap-8 border-b-1 border-border">
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label="hamburger"
        className="lg:hidden cursor-pointer p-2 rounded-radius hover:bg-muted transition"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-base grow">{dashboardName}</h1>

      <button className="relative cursor-pointer">
        <Bell size={20} />
        {newNotification && (
          <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
        )}
      </button>

      <button className="bg-primary text-primary-foreground hover:bg-primary-dark p-2 rounded-full transition cursor-pointer">
        <User size={20} />
      </button>
    </header>
  );
};

export default Header;
