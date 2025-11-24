import { Bell, Menu, User } from "lucide-react";
import { useSidebarContext } from "../../../context/useSidebarContext";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

const Header = () => {
  const { currentUser } = useAuthStore();
  const { setIsSidebarOpen } = useSidebarContext();
  const newNotification = true;
  const { pathname } = useLocation();

  const dynamicDashboardName = (pathname: string) => {
    if (pathname === "/home") return "Dashboard Overview";

    const refinedName = pathname.replace("/home/", "").replace("-", " ");

    return refinedName
      .split(" ")
      .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
      .join(" ");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background lg:left-1/6 py-4 px-6 md:px-8 flex items-center gap-8 border-b-1 border-border">
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label="hamburger"
        className="lg:hidden cursor-pointer p-2 rounded-radius hover:bg-muted transition"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-base grow">{dynamicDashboardName(pathname)}</h1>

      <button className="relative cursor-pointer">
        <Bell size={20} />
        {newNotification && (
          <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
        )}
      </button>

      <button className="bg-primary w-10 h-10 flex justify-center items-center p-0.5 text-primary-foreground hover:bg-primary-dark rounded-full transition cursor-pointer">
        {currentUser && currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt="User avatar"
            className="w-full h-full rounded-full object-fill"
          />
        ) : (
          <User size={20} />
        )}
      </button>
    </header>
  );
};

export default Header;
