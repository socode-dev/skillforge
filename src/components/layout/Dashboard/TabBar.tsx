import { Link, useLocation } from "react-router-dom";
import { sidebarData } from "../../../data/sidebarData";
import clsx from "clsx";

const TabBar = () => {
  const location = useLocation();
  const tabBarData = sidebarData
    .filter((data) => data.link !== "/home/settings")
    .map((data) => ({
      ...data,
      label: data.label === "Skill Requests" ? "Requests" : data.label,
    }));

  return (
    <footer className="md:hidden fixed bottom-0 w-full bg-card border-border border-t-1 px-6 py-2">
      <nav className="w-full grid grid-cols-5 gap-1 sm:gap-2">
        {tabBarData.map((data) => {
          const Icon = data.icon;

          return (
            <Link
              key={data.id}
              to={data.link}
              className={clsx(
                "flex flex-col gap-1 items-center p-2 rounded-radius transition duration-500",
                location.pathname === data.link &&
                  "bg-soft-primary text-primary"
              )}
            >
              <Icon size={20} />
              <span className="text-xs">{data.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default TabBar;
