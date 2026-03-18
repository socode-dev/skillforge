import { Link, useLocation } from "react-router-dom";
import { sidebarData } from "@/data/sidebarData";
import clsx from "clsx";
import useAuthStore from "@/store/useAuthStore";
import useChatStore from "@/store/useChatStore";

const TabBar = () => {
  const location = useLocation();
  const {currentUser} = useAuthStore();
  const {lastMessages} = useChatStore();

  const newMessagesCount = currentUser
    ? Object.values(lastMessages).reduce((totalCount, message) => {
        const userNewMessageCount =
          message.unreadCount?.[currentUser.profile.userId] ?? 0;
        return totalCount + userNewMessageCount;
      }, 0)
    : 0;

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
          const isActive = location.pathname === data.link || location.pathname.includes(`${data.link}/thread`);

          return (
            <Link
              key={data.id}
              to={data.link}
              className={clsx(
                "relative flex flex-col gap-1 items-center p-2 rounded-radius transition duration-500",
                isActive &&
                  "bg-soft-primary text-primary",
              )}
            >
              {(data.label === "Messages" && newMessagesCount > 0) && (
                <span className="absolute top-0 right-6 min-w-4 h-4 flex justify-center items-center text-xs bg-primary text-primary-foreground rounded-full">{newMessagesCount}</span>
              )}
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
