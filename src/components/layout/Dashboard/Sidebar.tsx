import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/skillforge-logo.webp";
import { sidebarData } from "../../../data/sidebarData";
import { LogOut, User } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";
import clsx from "clsx";

const Sidebar = () => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const onSignout = useAuthStore((state) => state.onSignout);

  if (!currentUser) return;

  return (
    <>
      <figure className="flex items-center gap-2 px-6 mt-5">
        <img src={logo} alt="SkillForge logo" loading="lazy" className="w-10" />
        <figcaption className="text-primary">SkillForge</figcaption>
      </figure>

      <nav className="flex flex-col grow mt-10 px-4">
        {sidebarData.map((data) => {
          const Icon = data.icon;
          const isActive = location.pathname === data.link;

          return (
            <Link
              key={data.id}
              to={data.link}
              className={clsx(
                "flex items-center gap-3 h-12 py-1.5 text-muted-foreground rounded-radius overflow-hidden",
                isActive && "bg-muted text-primary"
              )}
            >
              <div
                className={clsx(
                  "w-1 h-full rounded-tr-radius rounded-br-radius",
                  isActive && "bg-primary"
                )}
              />
              <div className="flex items-center gap-2">
                <Icon size={20} />
                <span>{data.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <figure className="w-full p-6 flex items-center gap-3 border-t-1 border-border">
        <div
          className="min-w-10 h-10 p-0.5 bg-soft-primary text-primary rounded-full flex items-center justify-center" >
            <User size={20} />
        </div>

        <figcaption className="w-full text-foreground">
          <span className="inline-block w-[90%] truncate text-base">
            {currentUser?.profile?.name}
          </span>

          <button
            onClick={onSignout}
            className="flex items-center gap-2 text-destructive cursor-pointer"
          >
            <LogOut size={14} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </figcaption>
      </figure>
    </>
  );
};

export default Sidebar;
