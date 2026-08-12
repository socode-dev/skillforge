import Input from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ListInterface from "@/pages/messages/components/ListInterface";
import useChatStore from "@/store/useChatStore";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import EmptyChatState from "@/pages/messages/components/EmptyChatState";
import { getCreatedAtDate } from "@/utils/groupMessagesByDate";

const ChatList = () => {
  const lastMessages = useChatStore(state => state.lastMessages);
  const [searchValue, setSearchValue] = useState("");

  const sortedLastMessages = useMemo(
    () =>
      Object.values(lastMessages).sort(
        (a, b) =>
          getCreatedAtDate(b.createdAt).getTime() -
          getCreatedAtDate(a.createdAt).getTime()
      ),
    [lastMessages]
  );

  const filteredLastMessages = useMemo(() => sortedLastMessages.filter(lm => {
    const search = searchValue.toLowerCase();
    return (lm.senderDisplay.name ?? "").toLowerCase().includes(search) || (lm.senderDisplay.role ?? "").toLowerCase().includes(search) || (lm.text ?? "").toLowerCase().includes(search);
  }), [sortedLastMessages, searchValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }, []);

  if(!sortedLastMessages.length) {
    
    return <EmptyChatState />
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full pb-10"
    >
      <fieldset className="w-full relative px-6 md:px-8">
        <Search
          size={16}
          className="absolute text-muted-foreground top-[50%] translate-y-[-50%] ml-2"
        />
        <Input
          type="search"
          placeholder="Search conversations..."
          className="w-full py-2.5 pl-10 pr-5"
          value={searchValue}
          onChange={handleChange}
        />
      </fieldset>

      <section className="w-full mt-6">
        {sortedLastMessages ? (
          <>
          {filteredLastMessages.map(lastMessage => (
            <ListInterface key={lastMessage.chatId} lastMessage={lastMessage} />
          ))}
          </>
        ) : (
          <div>
            <p>You have no messages</p>
          </div>
        )}
      </section>
    </motion.main>
  );
};

export default ChatList;
